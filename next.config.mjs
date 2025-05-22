// next.config.mjs

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  // other next.js config
};

const pwaOptions = {
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'service-worker.js',
};

const withPWA = (await import('next-pwa')).default(pwaOptions);

export default withPWA(nextConfig);
