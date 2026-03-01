import { fetchAPI, formatPrice, getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q = '' } = await searchParams;
  const keyword = q.trim();

  const [productsRes, postsRes] = keyword
    ? await Promise.all([
        fetchAPI('/san-phams', {
          filters: {
            $or: [
              { TenSanPham: { $containsi: keyword } },
              { MoTaNgan: { $containsi: keyword } },
            ],
          },
          populate: { AnhDaiDien: { populate: '*' } },
          sort: 'createdAt:desc',
          pagination: { limit: 12 },
        }),
        fetchAPI('/bai-viets', {
          filters: {
            $or: [
              { TieuDe: { $containsi: keyword } },
              { MoTaNgan: { $containsi: keyword } },
            ],
          },
          populate: { HinhDaiDien: { populate: '*' } },
          sort: 'NgayDang:desc',
          pagination: { limit: 12 },
        }),
      ])
    : [{ data: [] }, { data: [] }];

  const products = productsRes?.data || [];
  const posts = postsRes?.data || [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
        Kết quả tìm kiếm
      </h1>

      <form method="GET" className="mb-8 flex flex-col md:flex-row gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Nhập từ khóa sản phẩm hoặc bài viết..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 active:scale-95 transition-all duration-200">
          Tìm kiếm
        </button>
      </form>

      <p className="text-sm text-gray-600 mb-8">
        Từ khóa: <span className="font-semibold text-emerald-600">{keyword || '(trống)'}</span> • {products.length} sản phẩm • {posts.length} bài viết
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-5">Sản phẩm</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => {
              const imageUrl = getStrapiMedia(product.AnhDaiDien);
              return (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <Link href={`/san-pham/${product.Slug}`}>
                    <div className="relative w-full h-52 overflow-hidden">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={product.TenSanPham}
                          fill
                          unoptimized
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-12">
                      <Link href={`/san-pham/${product.Slug}`} className="hover:text-green-600 transition-colors">
                        {product.TenSanPham}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 min-h-15 mb-3">{product.MoTaNgan}</p>
                    <p className="font-bold text-emerald-600 text-lg">{formatPrice(product.Gia)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-600">Không có sản phẩm phù hợp.</div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-5">Bài viết</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => {
              const imageUrl = getStrapiMedia(post.HinhDaiDien);
              return (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <Link href={`/kien-thuc/${post.Slug}`}>
                    <div className="relative w-full h-52 overflow-hidden">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={post.TieuDe}
                          fill
                          unoptimized
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-2">{new Date(post.NgayDang).toLocaleDateString('vi-VN')}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-12">
                      <Link href={`/kien-thuc/${post.Slug}`} className="hover:text-green-600 transition-colors">
                        {post.TieuDe}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 min-h-15">{post.MoTaNgan}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-600">Không có bài viết phù hợp.</div>
        )}
      </section>
      </div>
    </div>
  );
};

export default SearchPage;
