import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "opulent-space-doodle-wr7jgjx9gr6wh59gv-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
