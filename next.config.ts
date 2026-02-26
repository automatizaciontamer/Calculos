
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática para compatibilidad con GitHub Pages y hosting web simple
  output: 'export',
  distDir: 'out',
  
  // IMPORTANTE: Si tu repositorio en GitHub NO es el principal (usuario.github.io),
  // descomenta la línea de abajo y pon el nombre de tu repositorio.
  // Ejemplo: si tu repo es github.com/tamer/calculadora, pon '/calculadora'
  // basePath: '/nombre-de-tu-repo',

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
