import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Images are sent as base64 data URIs through Server Actions.
      // Base64 adds ~33% overhead, so 3 × 10 MB images ≈ 40 MB raw base64.
      // 50mb gives comfortable headroom for the maximum 3-image upload.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
