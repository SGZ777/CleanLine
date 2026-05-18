/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Permite qualquer imagem do Cloudinary
      },
    ],
  },
};

module.exports = nextConfig;