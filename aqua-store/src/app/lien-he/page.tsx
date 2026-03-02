// src/app/lien-he/page.tsx
"use client";

import { useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., send to an API endpoint)
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setFormData({ name: '', phone: '', content: '' });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center my-8">Liên Hệ Với {siteConfig.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea
                id="content"
                name="content"
                rows={5}
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all"
            >
              Gửi Liên Hệ
            </button>
          </form>
        </div>

        {/* Right: Info & Map */}
        <div>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h3 className="text-2xl font-bold mb-4">Thông tin cửa hàng</h3>
              <p className="mb-2"><strong>Địa chỉ:</strong> {siteConfig.address}</p>
              <p className="mb-2"><strong>Hotline:</strong> <a href={`tel:${siteConfig.phoneRaw}`} className="text-green-600 hover:underline">{siteConfig.phoneDisplay}</a></p>
              <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${siteConfig.email}`} className="text-green-600 hover:underline">{siteConfig.email}</a></p>
                <p><strong>Giờ mở cửa:</strong> 8:00 - 21:00, mỗi ngày</p>
            </div>
          <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d646.2499054265593!2d105.6961390827217!3d20.919904190931305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31344dfb154d2869%3A0xc771c41746ca8da0!2zQ2jDumMgTMO9LCBOZ-G7jWMgSMOyYSwgQ2jGsMahbmcgTeG7uSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1772422532711!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
