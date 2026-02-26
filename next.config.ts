import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática obligatoria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // IMPORTANTE: Si tu repositorio en GitHub NO se llama "nombre-usuario.github.io"
  // sino que tiene un nombre como "mi-calculadora", debes poner ese nombre abajo:
  // basePath: '/mi-calculadora',

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
