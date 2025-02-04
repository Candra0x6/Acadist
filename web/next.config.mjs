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
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, context) => {
      // Enable polling based on env variable being set
      if(process.env.NEXT_WEBPACK_USEPOLLING) {
        config.watchOptions = {
          poll: 500,
          aggregateTimeout: 300
        }
      }
      return config
    },
  };
  

export default nextConfig;
