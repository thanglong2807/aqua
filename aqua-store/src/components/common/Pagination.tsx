import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  createPageHref: (targetPage: number) => string;
  className?: string;
};

const Pagination = ({
  currentPage,
  pageCount,
  createPageHref,
  className = 'mt-10',
}: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className={`${className} flex items-center justify-center gap-2 flex-wrap`}>
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
  );
};

export default Pagination;
