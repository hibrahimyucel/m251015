import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /*  {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000",
          },*/
          {
            key: "Access-Control-Allow-Methods",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
          /* {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },*/
        ],
      },
    ];
  },
};

export default nextConfig;
/*module.exports = {
  allowedDevOrigins: [
    "192.168.1.116",
    "*.sponge-prepared-commonly.ngrok-free.app",
    "*.local-origin.dev",
  ],
};
*/
