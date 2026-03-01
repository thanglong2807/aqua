// This file is now using dynamic data from Strapi
import { fetchAPI, formatPrice, getStrapiMedia } from '@/lib/api';
import { siteConfig } from '@/lib/siteConfig';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Generate static paths for each category
export async function generateStaticParams() {
  const categoriesRes = await fetchAPI('/danh-mucs');
  return categoriesRes.data.map((category: any) => ({
    slug: category.Slug,
  }));
}

// Fetch data for a specific category
async function getCategoryData(slug: string) {
    const categoriesRes = await fetchAPI('/danh-mucs', {
        filters: { Slug: { $eq: slug } },
        populate: {
            san_phams: {
                populate: {
                    AnhDaiDien: {
                        populate: '*'
                    }
                }
            }
        }
    });
    return categoriesRes.data[0];
}

function toNumericPrice(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return Number.NaN;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}


const ProductCategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) => {
  const { slug } = await params;
  const { sort = 'newest', page = '1' } = await searchParams;
  const currentPage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const pageSize = 8;
  const category = await getCategoryData(slug);

  if (!category) {
    return <div className="container mx-auto p-4 text-center">Không tìm thấy danh mục.</div>;
  }

  const { TenDanhMuc, san_phams } = category;
  const categoryProducts = Array.isArray(san_phams)
    ? san_phams
    : Array.isArray(san_phams?.data)
      ? san_phams.data
      : [];

  const filteredProducts = categoryProducts
    .slice()
    .sort((left: any, right: any) => {
      if (sort === 'name_asc') {
        return String(left?.TenSanPham || '').localeCompare(String(right?.TenSanPham || ''), 'vi');
      }

      if (sort === 'gia_asc' || sort === 'gia_desc') {
        const leftPrice = toNumericPrice(left?.Gia);
        const rightPrice = toNumericPrice(right?.Gia);

        if (Number.isNaN(leftPrice) && Number.isNaN(rightPrice)) return 0;
        if (Number.isNaN(leftPrice)) return 1;
        if (Number.isNaN(rightPrice)) return -1;

        return sort === 'gia_asc' ? leftPrice - rightPrice : rightPrice - leftPrice;
      }

      return 0;
    });

  const totalItems = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const normalizedPage = Math.min(currentPage, pageCount);
  const paginatedProducts = filteredProducts.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize);

  const createPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (sort && sort !== 'newest') {
      params.set('sort', sort);
    }
    params.set('page', String(targetPage));
    return `/danh-muc/${slug}?${params.toString()}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
  <div className="max-w-7xl mx-auto px-4 md:px-6">

    {/* ===== TIÊU ĐỀ ===== */}
    <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 
             bg-linear-to-r from-emerald-600 to-green-400 
                   bg-clip-text text-transparent">
      {TenDanhMuc}
    </h1>

    {/* ===== FILTER ===== */}
    <form 
      method="GET" 
      className="mb-10 flex flex-col md:flex-row md:items-center gap-4 
                 p-6 bg-white rounded-2xl border border-gray-100 
                 shadow-sm"
    >
      <label className="text-sm font-semibold text-gray-700">
        Sắp xếp sản phẩm
      </label>

      <select 
        name="sort" 
        defaultValue={sort}
        className="md:min-w-64 border border-gray-200 rounded-xl 
                   px-4 py-2 bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 
                   transition"
      >
        <option value="newest">Mặc định</option>
        <option value="name_asc">Tên A-Z</option>
        <option value="gia_asc">Giá tăng dần</option>
        <option value="gia_desc">Giá giảm dần</option>
      </select>

      <div className="flex gap-3 md:ml-auto">
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-emerald-600 text-white 
                     rounded-xl font-medium 
                     hover:bg-emerald-700 active:scale-95 
                     transition-all duration-200"
        >
          Áp dụng
        </button>

        <Link 
          href={`/danh-muc/${slug}`} 
          className="px-6 py-2.5 border border-gray-200 
                     rounded-xl font-medium 
                     hover:bg-gray-50 active:scale-95 
                     transition-all duration-200"
        >
          Xóa lọc
        </Link>
      </div>
    </form>

    {/* ===== SỐ LƯỢNG ===== */}
    <p className="text-sm text-gray-600 mb-6">
      Tìm thấy <span className="font-semibold text-emerald-600">
        {totalItems}
      </span> sản phẩm
    </p>

    {/* ===== GRID SẢN PHẨM ===== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {paginatedProducts.map((product: any) => {
        const { TenSanPham, Slug, MoTaNgan, Gia, AnhDaiDien } = product;
        const imageUrl = getStrapiMedia(AnhDaiDien);

        return (
          <div 
            key={product.id} 
            className="bg-white rounded-2xl overflow-hidden 
                       shadow-sm hover:shadow-xl 
                       transition-all duration-300 
                       group border border-gray-100"
          >
            {/* ẢNH */}
            <Link href={`/san-pham/${Slug}`}>
              <div className="relative w-full h-56 overflow-hidden">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={TenSanPham}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
            </Link>

            {/* CONTENT */}
            <div className="p-5 flex flex-col h-50">
              
              {/* Tên */}
              <h3 className="text-base font-semibold mb-2 line-clamp-2">
                <Link 
                  href={`/san-pham/${Slug}`} 
                  className="hover:text-emerald-600 transition-colors"
                >
                  {TenSanPham}
                </Link>
              </h3>

              {/* Mô tả */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {MoTaNgan}
              </p>

              {/* Giá + CTA */}
              <div className="mt-auto flex justify-between items-center">
                <span className="font-bold text-emerald-600 text-lg">
                  {formatPrice(Gia)}
                </span>

                <a 
                  href={siteConfig.zaloUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 text-sm font-medium text-white 
                             bg-emerald-500 rounded-xl 
                             hover:bg-emerald-600 
                             transition-all"
                >
                  Liên hệ
                </a>
              </div>

            </div>
          </div>
        );
      })}
    </div>

    {/* ===== EMPTY STATE ===== */}
    {paginatedProducts.length === 0 && (
      <div className="mt-16 text-center text-gray-500">
        Không có sản phẩm phù hợp bộ lọc.
      </div>
    )}

    {pageCount > 1 && (
      <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
        <Link
          href={createPageHref(Math.max(1, normalizedPage - 1))}
          className={`px-4 py-2 rounded-xl border transition ${
            normalizedPage <= 1
              ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-200'
              : 'bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          Trước
        </Link>

        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
          <Link
            key={pageNumber}
            href={createPageHref(pageNumber)}
            className={`px-4 py-2 rounded-xl border transition ${
              pageNumber === normalizedPage
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            {pageNumber}
          </Link>
        ))}

        <Link
          href={createPageHref(Math.min(pageCount, normalizedPage + 1))}
          className={`px-4 py-2 rounded-xl border transition ${
            normalizedPage >= pageCount
              ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-200'
              : 'bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          Sau
        </Link>
      </div>
    )}

  </div>
</div>
  );
};

export default ProductCategoryPage;
