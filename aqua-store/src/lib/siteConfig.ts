export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Đức Đạt Aqua',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Chuyên cung cấp các loại cá cảnh, cây thủy sinh, và phụ kiện hồ cá chất lượng cao.',
  phoneRaw: process.env.NEXT_PUBLIC_CONTACT_PHONE_RAW || '0987654321',
  phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || '098 765 4321',
  zaloUrl: process.env.NEXT_PUBLIC_CONTACT_ZALO_URL || 'https://zalo.me/0987654321',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'TP. HCM, Việt Nam',
  facebookUrl: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#',
  youtubeUrl: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#',
  tiktokUrl: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '#',
};
