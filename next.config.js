/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    // Required for FFmpeg.wasm to work
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      os: false,
    };

    // Add WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  output: "standalone",
  // Enable experimental features needed for FFmpeg
  experimental: {
    serverComponentsExternalPackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
};

module.exports = nextConfig;
