// src/app/san-pham/[slug]/page.tsx
import { fetchAPI, formatPrice, getStrapiMedia } from '@/lib/api';
import { siteConfig } from '@/lib/siteConfig';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  try {
    const productsRes = await fetchAPI('/san-phams');
    return (productsRes?.data || []).map((product: any) => ({
      slug: product.Slug,
    }));
  } catch {
    return [];
  }
}

async function getProductData(slug: string) {
  try {
    const productsRes = await fetchAPI('/san-phams', {
        filters: { Slug: { $eq: slug } },
        populate: {
            AnhDaiDien: { populate: '*' },
            GalleryAnh: { populate: '*' },
            danh_muc: { populate: '*' },
        }
    });
    return productsRes.data[0];
  } catch {
    return null;
  }
}

async function getRelatedProducts(productId: number, categoryId?: number) {
  try {
    const relatedRes = await fetchAPI('/san-phams', {
      filters: {
        ...(categoryId ? { danh_muc: { id: { $eq: categoryId } } } : {}),
        id: { $ne: productId },
      },
      populate: {
        AnhDaiDien: { populate: '*' },
      },
      sort: 'createdAt:desc',
      pagination: { limit: 4 },
    });

    const related = relatedRes?.data || [];
    if (related.length > 0) return related;

    const fallbackRes = await fetchAPI('/san-phams', {
      filters: { id: { $ne: productId } },
      populate: {
        AnhDaiDien: { populate: '*' },
      },
      sort: 'createdAt:desc',
      pagination: { limit: 4 },
    });

    return fallbackRes?.data || [];
  } catch {
    return [];
  }
}

function extractBlockText(children: any[] = []): string {
  return children
    .map((child: any): string => {
      if (child?.text) return child.text;
      if (Array.isArray(child?.children)) return extractBlockText(child.children);
      return '';
    })
    .join('');
}

const ProductDetailPage = async ({ params }: { params: Promise<{ slug:string }> }) => {
  const { slug } = await params;
  const product = await getProductData(slug);

  if (!product) {
    return <div className="container mx-auto p-4 text-center">Không tìm thấy sản phẩm.</div>;
  }

  // Assuming flat structure
  const { TenSanPham, Gia, MoTaNgan, ThongTinChiTiet, AnhDaiDien, GalleryAnh } = product;

  const mainImageUrl = getStrapiMedia(AnhDaiDien) || getStrapiMedia(Array.isArray(GalleryAnh) ? GalleryAnh[0] : null);
  const galleryImageUrls = GalleryAnh?.map((img: any) => getStrapiMedia(img)) || [];
  const displayImages = [mainImageUrl, ...galleryImageUrls].filter(Boolean);

  const detailsIsMarkdown = typeof ThongTinChiTiet === 'string';
  const detailsBlocks = Array.isArray(ThongTinChiTiet) ? ThongTinChiTiet : [];
  const categoryId = product?.danh_muc?.id || product?.danh_muc?.data?.id;
  const relatedProducts = await getRelatedProducts(product.id, categoryId);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Column: Image Gallery */}
        <div>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100">
            {mainImageUrl && <Image
              src={mainImageUrl}
              alt={TenSanPham}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {displayImages.map((imgUrl, index) => (
              <div key={index} className="relative w-full h-24 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-colors">
                <Image
                  src={imgUrl}
                  alt={`${TenSanPham} gallery image ${index + 1}`}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">{TenSanPham}</h1>
          <p className="text-2xl font-semibold text-emerald-600 mb-6">{formatPrice(Gia, 'Giá: Liên hệ')}</p>
          <p className="text-gray-700 mb-6">{MoTaNgan}</p>
          
          {ThongTinChiTiet && (
            <div className="prose max-w-none mb-8">
              {detailsIsMarkdown ? (
                <ReactMarkdown>{ThongTinChiTiet}</ReactMarkdown>
              ) : (
                detailsBlocks.map((block: any, index: number) => {
                  const text = extractBlockText(block?.children);
                  if (!text) return null;

                  if (block.type === 'heading') {
                    return <h3 key={index}>{text}</h3>;
                  }

                  return <p key={index}>{text}</p>;
                })
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <a href={`tel:${siteConfig.phoneRaw}`} className="flex-1 text-center px-6 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all">
              {`Gọi ngay: ${siteConfig.phoneDisplay}`}
            </a>
            <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-all">
              Nhắn Zalo
            </a>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Sản phẩm tương tự</h2>

        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item: any) => {
              const itemImageUrl = getStrapiMedia(item.AnhDaiDien);
              return (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <Link href={`/san-pham/${item.Slug}`}>
                    <div className="relative w-full h-52 overflow-hidden">
                      {itemImageUrl && (
                        <Image
                          src={itemImageUrl}
                          alt={item.TenSanPham}
                          fill
                          unoptimized
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 min-h-12 mb-2">
                      <Link href={`/san-pham/${item.Slug}`} className="hover:text-emerald-600 transition-colors">
                        {item.TenSanPham}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-10 mb-3">{item.MoTaNgan}</p>
                    <p className="font-bold text-emerald-600">{formatPrice(item.Gia)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500">Hiện chưa có sản phẩm tương tự.</div>
        )}
      </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
