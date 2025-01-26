/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "110.39.184.210",
        port: "154",
        pathname: "/upload/**",
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
};

module.exports = nextConfig;
