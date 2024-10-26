/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/ultimate' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/ultimate' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/ultimate/upload.php' : '/api/upload'
    },
    env: {
        SERVER_API: 'http://127.0.0.1:4000'
    }
};

module.exports = nextConfig;
