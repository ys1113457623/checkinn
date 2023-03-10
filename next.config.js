/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/checkinn' : '',
  publicRuntimeConfig: {
    contextPath: process.env.NODE_ENV === 'production' ? '/checkinn' : '',
    uploadPath:
      process.env.NODE_ENV === 'production'
        ? '/checkinn/upload.php'
        : '/api/upload',
  },
};

module.exports = nextConfig;
