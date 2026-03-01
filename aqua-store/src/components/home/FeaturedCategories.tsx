import { getStrapiMedia } from '@/lib/api';
import Link from 'next/link';

const FeaturedCategories = ({ categories }: { categories: any[] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories && categories.map((category) => {
            // API has flat structure, no 'attributes' nesting
            const { TenDanhMuc, Slug, HinhAnh } = category;
            const imageUrl = getStrapiMedia(HinhAnh);
            console.log(`Category ${TenDanhMuc} image URL: ${imageUrl}`);
            return (
              <Link key={category.id} href={`/danh-muc/${Slug}`} className="group block text-center">
              <div
                className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg 
                group-hover:shadow-2xl transition-shadow duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{TenDanhMuc}</h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
