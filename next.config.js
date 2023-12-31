/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
			},
			{
				protocol: 'https',
				hostname: 'i.ytimg.com/vi',
			},
			{
				protocol: 'https',
				hostname: 'yt3.ggpht.com',
			},
		],
	},
};

module.exports = nextConfig;

// images.unsplash.com
