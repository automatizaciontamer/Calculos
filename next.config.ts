import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática obligatoria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // CONFIGURACIÓN CRÍTICA PARA GITHUB PAGES
  // Al ser tu repositorio 'https://github.com/automatizaciontamer/studio', el basePath debe ser '/studio'
  basePath: '/studio',
  assetPrefix: '/studio/',

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
