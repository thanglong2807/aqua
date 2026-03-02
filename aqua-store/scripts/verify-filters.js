const qs = require('qs');

const FE_BASE = 'http://localhost:3000';
const BE_BASE = 'http://localhost:1337';

function parsePrice(value) {
  if (value === null || value === undefined || value === '') return Number.NaN;
  const numeric = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isNaN(numeric) ? Number.NaN : numeric;
}

function normalize(text) {
  return String(text || '').trim();
}

function checkOrderInHtml(html, orderedTexts) {
  const indices = orderedTexts.map((text) => html.indexOf(normalize(text)));
  const allPresent = indices.every((index) => index !== -1);
  const ordered = indices.every((index, i) => i === 0 || index > indices[i - 1]);
  return { indices, allPresent, ordered };
}

function extractOrderedUniqueHrefs(html, pattern) {
  const matches = html.match(pattern) || [];
  const seen = new Set();
  const ordered = [];

  for (const match of matches) {
    if (!seen.has(match)) {
      seen.add(match);
      ordered.push(match);
    }
  }

  return ordered;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}: ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}: ${url}`);
  return res.text();
}

async function verifyBlogSort() {
  const query = qs.stringify(
    { pagination: { pageSize: 100 }, fields: ['TieuDe', 'NgayDang', 'Slug'] },
    { encodeValuesOnly: true }
  );
  const postRes = await fetchJson(`${BE_BASE}/api/bai-viets?${query}`);
  const posts = postRes?.data || [];

  if (posts.length < 2) {
    return { skipped: true, reason: 'Không đủ dữ liệu bài viết để kiểm tra sort.' };
  }

  const asc = [...posts].sort((a, b) => new Date(a.NgayDang) - new Date(b.NgayDang));
  const desc = [...asc].reverse();

  const ascHtml = await fetchText(`${FE_BASE}/kien-thuc?sort=date_asc`);
  const descHtml = await fetchText(`${FE_BASE}/kien-thuc?sort=date_desc`);

  const ascSlugs = asc.slice(0, Math.min(3, asc.length)).map((item) => `/kien-thuc/${item.Slug}`);
  const descSlugs = desc.slice(0, Math.min(3, desc.length)).map((item) => `/kien-thuc/${item.Slug}`);

  const ascRendered = extractOrderedUniqueHrefs(ascHtml, /\/kien-thuc\/[a-z0-9-]+/g).slice(0, ascSlugs.length);
  const descRendered = extractOrderedUniqueHrefs(descHtml, /\/kien-thuc\/[a-z0-9-]+/g).slice(0, descSlugs.length);
  const dateBySlug = Object.fromEntries(posts.map((item) => [String(item.Slug), String(item.NgayDang)]));

  const isMonotonicByDate = (renderedSlugs, direction) => {
    for (let i = 1; i < renderedSlugs.length; i += 1) {
      const prevSlug = renderedSlugs[i - 1].replace('/kien-thuc/', '');
      const currSlug = renderedSlugs[i].replace('/kien-thuc/', '');
      const prevDate = dateBySlug[prevSlug];
      const currDate = dateBySlug[currSlug];
      if (!prevDate || !currDate) return false;
      if (direction === 'asc' && prevDate > currDate) return false;
      if (direction === 'desc' && prevDate < currDate) return false;
    }
    return true;
  };

  const ascCheck = {
    allPresent: ascSlugs.every((slug) => ascRendered.includes(slug)),
    ordered: isMonotonicByDate(ascRendered, 'asc'),
    rendered: ascRendered,
  };

  const descCheck = {
    allPresent: descSlugs.every((slug) => descRendered.includes(slug)),
    ordered: isMonotonicByDate(descRendered, 'desc'),
    rendered: descRendered,
  };

  return {
    skipped: false,
    asc: { expected: ascSlugs, ...ascCheck },
    desc: { expected: descSlugs, ...descCheck },
  };
}

async function verifyCategorySort() {
  const categoryQuery = qs.stringify(
    {
      populate: { san_phams: { fields: ['TenSanPham', 'Gia', 'Slug'] } },
      pagination: { pageSize: 100 },
      fields: ['TenDanhMuc', 'Slug'],
    },
    { encodeValuesOnly: true }
  );

  const categoriesRes = await fetchJson(`${BE_BASE}/api/danh-mucs?${categoryQuery}`);
  const categories = categoriesRes?.data || [];
  const targetCategory = categories.find((item) => Array.isArray(item.san_phams) && item.san_phams.length >= 3);

  if (!targetCategory) {
    return { skipped: true, reason: 'Không đủ dữ liệu sản phẩm theo danh mục để kiểm tra sort.' };
  }

  const products = [...targetCategory.san_phams];
  const slug = targetCategory.Slug;

  const byNameAsc = [...products].sort((a, b) => String(a.TenSanPham || '').localeCompare(String(b.TenSanPham || ''), 'vi'));
  const byGiaAsc = [...products].sort((a, b) => {
    const left = parsePrice(a.Gia);
    const right = parsePrice(b.Gia);
    if (Number.isNaN(left) && Number.isNaN(right)) return 0;
    if (Number.isNaN(left)) return 1;
    if (Number.isNaN(right)) return -1;
    return left - right;
  });
  const byGiaDesc = [...products].sort((a, b) => {
    const left = parsePrice(a.Gia);
    const right = parsePrice(b.Gia);
    if (Number.isNaN(left) && Number.isNaN(right)) return 0;
    if (Number.isNaN(left)) return 1;
    if (Number.isNaN(right)) return -1;
    return right - left;
  });

  const nameHtml = await fetchText(`${FE_BASE}/danh-muc/${slug}?sort=name_asc`);
  const giaAscHtml = await fetchText(`${FE_BASE}/danh-muc/${slug}?sort=gia_asc`);
  const giaDescHtml = await fetchText(`${FE_BASE}/danh-muc/${slug}?sort=gia_desc`);

  const nameExpected = byNameAsc.slice(0, Math.min(3, byNameAsc.length)).map((item) => `/san-pham/${item.Slug}`);
  const giaAscExpected = byGiaAsc.slice(0, Math.min(3, byGiaAsc.length)).map((item) => `/san-pham/${item.Slug}`);
  const giaDescExpected = byGiaDesc.slice(0, Math.min(3, byGiaDesc.length)).map((item) => `/san-pham/${item.Slug}`);

  const nameRendered = extractOrderedUniqueHrefs(nameHtml, /\/san-pham\/[a-z0-9-]+/g).slice(0, nameExpected.length);
  const giaAscRendered = extractOrderedUniqueHrefs(giaAscHtml, /\/san-pham\/[a-z0-9-]+/g).slice(0, giaAscExpected.length);
  const giaDescRendered = extractOrderedUniqueHrefs(giaDescHtml, /\/san-pham\/[a-z0-9-]+/g).slice(0, giaDescExpected.length);

  return {
    skipped: false,
    category: targetCategory.TenDanhMuc,
    slug,
    nameAsc: {
      expected: nameExpected,
      rendered: nameRendered,
      allPresent: nameExpected.every((href) => nameRendered.includes(href)),
      ordered: JSON.stringify(nameRendered) === JSON.stringify(nameExpected),
    },
    giaAsc: {
      expected: giaAscExpected,
      rendered: giaAscRendered,
      allPresent: giaAscExpected.every((href) => giaAscRendered.includes(href)),
      ordered: JSON.stringify(giaAscRendered) === JSON.stringify(giaAscExpected),
    },
    giaDesc: {
      expected: giaDescExpected,
      rendered: giaDescRendered,
      allPresent: giaDescExpected.every((href) => giaDescRendered.includes(href)),
      ordered: JSON.stringify(giaDescRendered) === JSON.stringify(giaDescExpected),
    },
  };
}

(async () => {
  const result = {
    blog: await verifyBlogSort(),
    category: await verifyCategorySort(),
  };

  console.log(JSON.stringify(result, null, 2));

  const checks = [];

  if (!result.blog.skipped) {
    checks.push(result.blog.asc.allPresent && result.blog.asc.ordered);
    checks.push(result.blog.desc.allPresent && result.blog.desc.ordered);
  }

  if (!result.category.skipped) {
    checks.push(result.category.nameAsc.allPresent && result.category.nameAsc.ordered);
    checks.push(result.category.giaAsc.allPresent && result.category.giaAsc.ordered);
    checks.push(result.category.giaDesc.allPresent && result.category.giaDesc.ordered);
  }

  if (checks.length > 0 && checks.every(Boolean)) {
    console.log('\nFILTER_CHECK=PASS');
    process.exit(0);
  }

  if (checks.length === 0) {
    console.log('\nFILTER_CHECK=SKIPPED');
    process.exit(0);
  }

  console.log('\nFILTER_CHECK=FAIL');
  process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
