/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    // Externalize onnxruntime-web completely - don't bundle it at all
    config.externals = config.externals || [];
    config.externals.push({
      'onnxruntime-web': 'onnxruntime-web',
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Handle .wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
