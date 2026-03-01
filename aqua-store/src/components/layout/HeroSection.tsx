import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center text-center text-white">
      <Image
        src="/group-fish-swimming-aquarium.jpg" // Replace with a real banner image
        alt="Banner cá cảnh"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Thế Giới Thủy Sinh Sống Động</h1>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Khám phá bộ sưu tập cá cảnh, cây thủy sinh và phụ kiện độc đáo để tạo nên hồ cá trong mơ của bạn.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/danh-muc" className="px-8 py-3 font-semibold bg-green-500 rounded-xl hover:bg-green-600 transition-all">
            Xem sản phẩm
          </Link>
          <Link href="/lien-he" className="px-8 py-3 font-semibold bg-transparent border-2 border-white rounded-xl hover:bg-white hover:text-black transition-all">
            Tư vấn miễn phí
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
