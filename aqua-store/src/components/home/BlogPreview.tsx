import { getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const BlogPreview = ({ posts }: { posts: any[] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Kiến Thức Mới Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts && posts.map((post) => {
            // API has flat structure, no 'attributes' nesting
            const { TieuDe, Slug, MoTaNgan, NgayDang, HinhDaiDien } = post;
            const imageUrl = getStrapiMedia(HinhDaiDien);
            return (
              <div key={post.id} className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <Link href={`/kien-thuc/${Slug}`}>
                  <div className="relative w-full h-48">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={TieuDe}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                        className="transform group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{new Date(NgayDang).toLocaleDateString('vi-VN')}</p>
                  <h3 className="text-lg font-semibold mb-2 h-14">
                    <Link href={`/kien-thuc/${Slug}`} className="hover:text-green-600 transition-colors">{TieuDe}</Link>
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-sm h-12">{MoTaNgan}</p>
                  <Link href={`/kien-thuc/${Slug}`} className="text-green-600 font-semibold hover:underline mt-4 inline-block">
                    Đọc thêm &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
