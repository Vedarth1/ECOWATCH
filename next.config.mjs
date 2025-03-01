/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
	  // Disable TypeScript errors during builds
	  ignoreBuildErrors: true,
	}
  };
  
  import withPWAInit from "@ducanh2912/next-pwa";
  
  const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	swcMinify: true,
	disable: process.env.NODE_ENV === "development",
	workboxOptions: {
	  disableDevLogs: true,
	},
  });
  
  export default withPWA(nextConfig);