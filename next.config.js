/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "103.111.161.112",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      use: {
        loader: "file-loader",
        options: {
          outputPath: "static/media/",
          publicPath: "/_next/static/media/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "referrer-policy", value: "no-referrer" }],
      },
    ];
  },
};

module.exports = nextConfig;
