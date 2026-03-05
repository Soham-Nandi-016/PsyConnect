/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint runs separately via `npm run lint`. Warnings won't block the build.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

