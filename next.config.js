/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
 // assetPrefix: './',  //casuing socket HMR
  images: {
   // domains: ["rickandmortyapi.com"],
    loader: "custom",
    path: "/",
  },

}

module.exports = nextConfig 
