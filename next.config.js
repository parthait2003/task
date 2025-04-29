/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,       // ✅ Ignores ESLint errors during `next build`
    },
    typescript: {
        ignoreBuildErrors: true,        // ✅ Ignores TypeScript type errors during `next build`
    },
    webpack: (config) => {
        config.cache = false;           // ✅ Disables Webpack caching (for clean builds)
        return config;
    },
};

module.exports = nextConfig;
