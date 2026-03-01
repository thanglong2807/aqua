import BlogPreview from "@/components/home/BlogPreview";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/layout/HeroSection";
import { fetchAPI } from "@/lib/api";

export default async function Home() {
  // Fetching data from the API
  const [categoriesRes, productsRes, postsRes] = await Promise.all([
    fetchAPI('/danh-mucs', { populate: { HinhAnh: { populate: '*' } } }),
    fetchAPI('/san-phams', { 
      filters: { LaSanPhamNoiBat: { $eq: true } },
      populate: { AnhDaiDien: { populate: '*' } },
      pagination: { limit: 6 } 
    }),
    fetchAPI('/bai-viets', { 
      populate: { HinhDaiDien: { populate: '*' } },
      sort: 'NgayDang:desc',
      pagination: { limit: 3 }
    }),
  ]);
  
  // The data is now in the .data property of the response, provide fallback to empty array
  const categories = categoriesRes.data || [];
  const products = productsRes.data || [];
  const posts = postsRes.data || [];

  
  return (
    <>
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={products} />
      <BlogPreview posts={posts} />
    </>
  );
}
