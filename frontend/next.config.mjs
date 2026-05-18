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

// Como é um arquivo .mjs, usamos export default em vez de module.exports
export default nextConfig;