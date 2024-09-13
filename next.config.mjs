import dotenv from 'dotenv';
dotenv.config();



/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    imagesBucket: process.env.NEXT_PUBLIC_IMAGES_BUCKET,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:  process.env.NEXT_PUBLIC_IMAGES_BUCKET, //tripia-devimages-bucket-ioioioi.s3.us-east-1.amazonaws.com
        port: '',
        pathname: '/**',  // This allows all paths under the hostname
      }
    ],
  },
};

export default nextConfig;
