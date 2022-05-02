/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: './',
  images: {
   // domains: ["rickandmortyapi.com"],
    loader: "custom",
    path: "/",
  },
}

module.exports = nextConfig 
