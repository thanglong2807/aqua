require('dotenv').config({ path: '.env' });
const { Client } = require('pg');
const crypto = require('crypto');

const CATEGORY_SEEDS = [
  { name: 'Cá cảnh nước ngọt', slug: 'ca-canh-nuoc-ngot' },
  { name: 'Cá cảnh nước mặn', slug: 'ca-canh-nuoc-man' },
  { name: 'Tép cảnh', slug: 'tep-canh' },
  { name: 'Thủy sinh', slug: 'thuy-sinh' },
  { name: 'Phụ kiện hồ cá', slug: 'phu-kien-ho-ca' },
  { name: 'Thức ăn & chăm sóc', slug: 'thuc-an-va-cham-soc' },
];

function createDocumentId() {
  return crypto.randomBytes(12).toString('hex');
}

function createBlocksContent(productName, categoryName) {
  return [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: `${productName} thuộc nhóm ${categoryName}, phù hợp cho người mới lẫn người chơi lâu năm.`,
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Sản phẩm khỏe mạnh, dễ thích nghi và đã được kiểm tra chất lượng trước khi giao.',
        },
      ],
    },
  ];
}

function formatVnd(value) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

async function getExistingCounts(client) {
  const [categories, products] = await Promise.all([
    client.query('select count(*)::int as c from danh_mucs'),
    client.query('select count(*)::int as c from san_phams'),
  ]);

  return {
    categories: categories.rows[0].c,
    products: products.rows[0].c,
  };
}

async function clearExistingData(client) {
  await client.query('delete from files_related_mph where related_type in ($1, $2)', [
    'api::san-pham.san-pham',
    'api::danh-muc.danh-muc',
  ]);
  await client.query('delete from san_phams_danh_muc_lnk');
  await client.query('delete from san_phams');
  await client.query('delete from danh_mucs');
}

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const shouldClear = process.argv.includes('--clear');

  await client.connect();

  try {
    await client.query('begin');

    const existing = await getExistingCounts(client);
    if ((existing.categories > 0 || existing.products > 0) && !shouldClear) {
      throw new Error(
        `Phát hiện dữ liệu hiện có (danh_mucs=${existing.categories}, san_phams=${existing.products}). Chạy lại với --clear để xóa và seed mới.`
      );
    }

    if (shouldClear) {
      await clearExistingData(client);
    }

    const fileResult = await client.query('select id from files order by id asc');
    const fileIds = fileResult.rows.map((row) => row.id);

    const createdCategoryIds = [];
    const now = new Date();

    for (let i = 0; i < CATEGORY_SEEDS.length; i += 1) {
      const category = CATEGORY_SEEDS[i];

      const categoryInsert = await client.query(
        `insert into danh_mucs (document_id, ten_danh_muc, slug, created_at, updated_at, published_at)
         values ($1, $2, $3, $4, $4, $4)
         returning id`,
        [createDocumentId(), category.name, category.slug, now]
      );

      const categoryId = categoryInsert.rows[0].id;
      createdCategoryIds.push(categoryId);

      if (fileIds.length > 0) {
        const categoryFileId = fileIds[i % fileIds.length];
        await client.query(
          `insert into files_related_mph (file_id, related_id, related_type, field, "order")
           values ($1, $2, $3, $4, $5)`,
          [categoryFileId, categoryId, 'api::danh-muc.danh-muc', 'HinhAnh', 0]
        );
      }
    }

    let productCounter = 0;

    for (let categoryIndex = 0; categoryIndex < CATEGORY_SEEDS.length; categoryIndex += 1) {
      const category = CATEGORY_SEEDS[categoryIndex];
      const categoryId = createdCategoryIds[categoryIndex];

      for (let i = 1; i <= 10; i += 1) {
        productCounter += 1;

        const productName = `${category.name} Mẫu ${i}`;
        const productSlug = `${category.slug}-mau-${i}`;
        const price = 50000 + categoryIndex * 15000 + i * 12000;

        const productInsert = await client.query(
          `insert into san_phams (
             document_id,
             ten_san_pham,
             slug,
             mo_ta_ngan,
             thong_tin_chi_tiet,
             gia,
             la_san_pham_noi_bat,
             created_at,
             updated_at,
             published_at
           )
           values ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $8, $8)
           returning id`,
          [
            createDocumentId(),
            productName,
            productSlug,
            `${productName} khỏe, màu đẹp, phù hợp hồ gia đình và văn phòng.`,
            JSON.stringify(createBlocksContent(productName, category.name)),
            formatVnd(price),
            i <= 2,
            now,
          ]
        );

        const productId = productInsert.rows[0].id;

        await client.query(
          `insert into san_phams_danh_muc_lnk (san_pham_id, danh_muc_id, san_pham_ord)
           values ($1, $2, $3)`,
          [productId, categoryId, i]
        );

        if (fileIds.length > 0) {
          const coverFileId = fileIds[productCounter % fileIds.length];
          await client.query(
            `insert into files_related_mph (file_id, related_id, related_type, field, "order")
             values ($1, $2, $3, $4, $5)`,
            [coverFileId, productId, 'api::san-pham.san-pham', 'AnhDaiDien', 0]
          );
        }
      }
    }

    const [categoryCount, productCount] = await Promise.all([
      client.query('select count(*)::int as c from danh_mucs'),
      client.query('select count(*)::int as c from san_phams'),
    ]);

    await client.query('commit');

    console.log('Seed thành công.');
    console.log(`Danh mục: ${categoryCount.rows[0].c}`);
    console.log(`Sản phẩm: ${productCount.rows[0].c}`);
  } catch (error) {
    await client.query('rollback');
    console.error('Seed thất bại:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
