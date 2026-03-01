// src/app/kien-thuc/[slug]/page.tsx
import { fetchAPI, getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const postsRes = await fetchAPI('/bai-viets');
  return (postsRes?.data || []).map((post: any) => ({
    slug: post.Slug,
  }));
}

async function getPostData(slug: string) {
  const postRes = await fetchAPI('/bai-viets', {
    filters: { Slug: { $eq: slug } },
    populate: { HinhDaiDien: { populate: '*' } },
  });
  return postRes?.data?.[0] || null;
}

async function getRelatedPosts(postId: number) {
  const postsRes = await fetchAPI('/bai-viets', {
    populate: { HinhDaiDien: { populate: '*' } },
    sort: 'NgayDang:desc',
    pagination: { limit: 4 },
  });
  const posts = postsRes?.data || [];
  return posts.filter((item: any) => item.id !== postId).slice(0, 3);
}

function extractBlockText(children: any[] = []) {
  return children.map((child: any) => child?.text || '').join('');
}

const PostDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    return <div className="container mx-auto p-4 text-center">Không tìm thấy bài viết.</div>;
  }

  const relatedPosts = await getRelatedPosts(post.id);
  const imageUrl = getStrapiMedia(post.HinhDaiDien);
  const blocks = Array.isArray(post.NoiDung) ? post.NoiDung : [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8 prose lg:prose-xl max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">{post.TieuDe}</h1>
        <p className="text-gray-500 mb-4">Ngày đăng: {new Date(post.NgayDang).toLocaleDateString('vi-VN')}</p>
        <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-sm mb-8 border border-gray-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.TieuDe}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        <p>{post.MoTaNgan}</p>
        {blocks.map((block: any, index: number) => {
          const text = extractBlockText(block?.children);
          if (!text) return null;

          if (block.type === 'heading') {
            return <h2 key={index}>{text}</h2>;
          }

          return <p key={index}>{text}</p>;
        })}
      </article>

      <div className="mt-16 pt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Bài Viết Liên Quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost: any) => {
            const relatedImageUrl = getStrapiMedia(relatedPost.HinhDaiDien);
            return (
            <div key={relatedPost.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <Link href={`/kien-thuc/${relatedPost.Slug}`}>
                <div className="relative w-full h-48 overflow-hidden">
                  {relatedImageUrl && (
                    <Image
                      src={relatedImageUrl}
                      alt={relatedPost.TieuDe}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              </Link>
              <div className="p-5">
                <h3 className="text-lg font-semibold line-clamp-2 min-h-[56px]">
                  <Link href={`/kien-thuc/${relatedPost.Slug}`} className="hover:text-emerald-600 transition-colors">{relatedPost.TieuDe}</Link>
                </h3>
              </div>
            </div>
          )})}
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
