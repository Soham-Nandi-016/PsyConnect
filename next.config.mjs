const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'img.youtube.com' },
            { protocol: 'https', hostname: 'i.ytimg.com' },
        ],
    },
    // Add these two blocks below:
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig