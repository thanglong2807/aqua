import { siteConfig } from "@/lib/siteConfig";

const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-600">
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-green-600 mb-4">{siteConfig.name}</h3>
              <p>Chuyên cung cấp cá cảnh, phụ kiện và kiến thức thủy sinh.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
              <p>Địa chỉ: {siteConfig.address}</p>
              <p>Hotline: {siteConfig.phoneDisplay}</p>
              <p>Email: {siteConfig.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4">
                <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">Facebook</a>
                <a href={siteConfig.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">Youtube</a>
                <a href={siteConfig.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">Tiktok</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 border-t pt-4">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  