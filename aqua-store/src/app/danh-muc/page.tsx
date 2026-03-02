// src/app/danh-muc/page.tsx
import { fetchAPI, getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination';

export const dynamic = 'force-dynamic';

const AllCategoriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = '1' } = await searchParams;
  const requestedPage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const pageSize = 9;

  const firstResponse = await fetchAPI('/danh-mucs', {
    populate: { HinhAnh: { populate: '*' } },
    sort: 'createdAt:desc',
    pagination: {
      page: requestedPage,
      pageSize,
    },
  });
  const firstPagination = firstResponse?.meta?.pagination;
  const firstPageCount = Math.max(1, firstPagination?.pageCount || 1);
  const currentPage = Math.min(requestedPage, firstPageCount);

  const categoriesRes =
    requestedPage === currentPage
      ? firstResponse
      : await fetchAPI('/danh-mucs', {
          populate: { HinhAnh: { populate: '*' } },
          sort: 'createdAt:desc',
          pagination: {
            page: currentPage,
            pageSize,
          },
        });

  const categories = categoriesRes?.data || [];
  const pagination = categoriesRes?.meta?.pagination || firstPagination;
  const pageCount = Math.max(1, pagination?.pageCount || 1);

  const createPageHref = (targetPage: number) => `/danh-muc?page=${targetPage}`;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
          Tất Cả Danh Mục
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: any) => {
            const imageUrl = getStrapiMedia(category.HinhAnh);
            return (
            <Link key={category.id} href={`/danh-muc/${category.Slug}`} className="group block text-center">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={category.TenDanhMuc}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent"></div>
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <h3 className="text-2xl font-bold text-white">{category.TenDanhMuc}</h3>
                </div>
              </div>
            </Link>
          )})}
        </div>

        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          createPageHref={createPageHref}
          className="mt-10"
        />
      </div>
    </div>
  );
};

export default AllCategoriesPage;
