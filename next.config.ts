import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática obligatoria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // IMPORTANTE: Cambia 'tamer-industrial-app' por el nombre exacto de tu repositorio en GitHub
  // Si tu repo se llama 'mi-calculadora', debe ser '/mi-calculadora'
  basePath: '/tamer-industrial-app',
  assetPrefix: '/tamer-industrial-app/',

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
