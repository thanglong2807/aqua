// src/app/kien-thuc/page.tsx
import { fetchAPI, getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) => {
  const { sort = 'date_desc', page = '1' } = await searchParams;
  const currentPage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const pageSize = 9;

  const query: any = {
    populate: { HinhDaiDien: { populate: '*' } },
    sort: sort === 'date_asc' ? 'NgayDang:asc' : 'NgayDang:desc',
    pagination: {
      page: currentPage,
      pageSize,
    },
  };

  const postsRes = await fetchAPI('/bai-viets', query);
  const posts = postsRes?.data || [];
  const pagination = postsRes?.meta?.pagination;
  const pageCount = Math.max(1, pagination?.pageCount || 1);

  const createPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (sort && sort !== 'date_desc') {
      params.set('sort', sort);
    }
    params.set('page', String(targetPage));
    return `/kien-thuc?${params.toString()}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
          Kiến Thức Thủy Sinh
        </h1>

        <form method="GET" className="mb-8 flex flex-col md:flex-row gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <label className="text-sm font-semibold text-gray-700 md:self-center">Sắp xếp bài viết</label>
          <select name="sort" defaultValue={sort} className="md:min-w-64 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition">
            <option value="date_desc">Mới nhất</option>
            <option value="date_asc">Cũ nhất</option>
          </select>
          <div className="flex gap-3 md:ml-auto">
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 active:scale-95 transition-all duration-200">
              Áp dụng
            </button>
            <Link href="/kien-thuc" className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200">
              Xóa lọc
            </Link>
          </div>
        </form>

        <p className="text-sm text-gray-600 mb-6">
          Tìm thấy <span className="font-semibold text-emerald-600">{posts.length}</span> bài viết
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const imageUrl = getStrapiMedia(post.HinhDaiDien);
            return (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <Link href={`/kien-thuc/${post.Slug}`}>
                <div className="relative w-full h-56 overflow-hidden">
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
                <p className="text-sm text-gray-500 mb-2">{new Date(post.NgayDang).toLocaleDateString('vi-VN')}</p>
                <h3 className="text-lg font-semibold mb-3 line-clamp-2 min-h-14">
                  <Link href={`/kien-thuc/${post.Slug}`} className="hover:text-emerald-600 transition-colors">{post.TieuDe}</Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 min-h-15">{post.MoTaNgan}</p>
                <Link href={`/kien-thuc/${post.Slug}`} className="text-emerald-600 font-semibold hover:underline mt-4 inline-block">
                  Đọc thêm &rarr;
                </Link>
              </div>
            </div>
          )})}
        </div>

        {posts.length === 0 && (
          <div className="mt-10 text-center text-gray-500">Không có bài viết phù hợp bộ lọc.</div>
        )}

        {pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <Link
              href={createPageHref(Math.max(1, currentPage - 1))}
              className={`px-4 py-2 rounded-xl border transition ${
                currentPage <= 1
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
                  pageNumber === currentPage
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href={createPageHref(Math.min(pageCount, currentPage + 1))}
              className={`px-4 py-2 rounded-xl border transition ${
                currentPage >= pageCount
                  ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-200'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              Sau
            </Link>
          </div>
        )}

        <div className="mt-16 text-center text-gray-500">
          Phân trang sẽ được thêm vào đây.
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
