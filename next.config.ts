import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática obligatoria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // IMPORTANTE: Si tu repo NO es 'usuario.github.io', 
  // debes poner el nombre de tu repositorio aquí abajo.
  // Ejemplo: basePath: '/calculadora-tamer',
  // basePath: '',

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
