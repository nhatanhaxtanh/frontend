import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'volkswagenflagship.vn' },
      // Tên miền cũ: ảnh upload lưu URL tuyệt đối, giữ đến khi đã đổi URL trong database
      { protocol: 'https', hostname: 'volkswagenanphu.vn' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
