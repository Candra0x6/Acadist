/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https', // Allow HTTPS images
          hostname: '**', // Allow all domains
        },
        {
          protocol: 'http', // Allow HTTP images (if needed)
          hostname: '**', // Allow all domains
        },
      ],
    },
  };
  

export default nextConfig;
