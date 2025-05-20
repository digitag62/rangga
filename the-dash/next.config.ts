import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000", "friendly-fortnight-4j79w96gwgvj29jw-3000.app.github.dev"],
		},
	},
};

export default nextConfig;
