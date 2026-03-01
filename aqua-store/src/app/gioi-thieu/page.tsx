// src/app/gioi-thieu/page.tsx
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="relative h-80">
        <Image
          src="/categories/aquascape-category.jpg" // Re-use a nice image
          alt="Giới thiệu Đức Đạt Aqua"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Về Chúng Tôi</h1>
        </div>
      </div>

      <div className="container mx-auto p-8 md:p-12">
        <div className="prose lg:prose-lg max-w-4xl mx-auto text-justify">
          <h2>Đức Đạt Aqua: Nơi Đam Mê Thủy Sinh Bùng Cháy</h2>
          <p>
            Chào mừng bạn đến với Đức Đạt Aqua, điểm đến lý tưởng cho những người yêu thích thế giới thủy sinh. Chúng tôi không chỉ là một cửa hàng bán cá cảnh và phụ kiện, mà còn là một cộng đồng nơi mọi người có thể chia sẻ niềm đam mê, học hỏi kinh nghiệm và cùng nhau tạo nên những tác phẩm nghệ thuật sống động dưới mặt nước.
          </p>
          <p>
            Được thành lập bởi những chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực cá cảnh và aquascaping, Đức Đạt Aqua tự hào mang đến cho khách hàng những sản phẩm chất lượng nhất, từ những chú cá khỏe mạnh, màu sắc rực rỡ đến các loại cây thủy sinh đa dạng và những bộ phụ kiện hiện đại, hiệu quả.
          </p>
          
          <h3>Sứ Mệnh Của Chúng Tôi</h3>
          <p>
            Sứ mệnh của Đức Đạt Aqua là lan tỏa niềm đam mê thủy sinh đến với mọi nhà. Chúng tôi tin rằng việc sở hữu một hồ cá đẹp không chỉ mang lại vẻ đẹp cho không gian sống mà còn là một liệu pháp thư giãn tinh thần tuyệt vời. Vì vậy, chúng tôi luôn nỗ lực:
          </p>
          <ul>
            <li><strong>Cung cấp sản phẩm chất lượng:</strong> Tuyển chọn kỹ lưỡng các loại cá, tép, cây và phụ kiện từ những nguồn uy tín.</li>
            <li><strong>Tư vấn tận tâm:</strong> Đội ngũ nhân viên giàu kinh nghiệm luôn sẵn sàng chia sẻ kiến thức, giúp bạn giải đáp mọi thắc mắc từ khâu chọn cá, setup hồ đến việc chăm sóc hàng ngày.</li>
            <li><strong>Xây dựng cộng đồng:</strong> Tạo ra một sân chơi bổ ích để mọi người cùng giao lưu, học hỏi và phát triển niềm đam mê.</li>
          </ul>

          <h3>Tại Sao Chọn Đức Đạt Aqua?</h3>
          <p>
            Đến với Đức Đạt Aqua, bạn không chỉ mua được sản phẩm tốt mà còn nhận được sự hỗ trợ toàn diện. Chúng tôi cam kết đồng hành cùng bạn trên hành trình chinh phục đam mê thủy sinh. Hãy để Đức Đạt Aqua giúp bạn biến ý tưởng về một hồ cá trong mơ thành hiện thực!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
