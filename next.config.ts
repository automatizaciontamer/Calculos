import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática necesaria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // Si estamos en producción (GitHub Actions), usamos /studio
  // En desarrollo (Studio local), usamos la raíz '' para evitar el error 404
  basePath: process.env.NODE_ENV === 'production' ? '/studio' : '',
  
  images: {
    unoptimized: true,
  },

  // Obliga a que todas las rutas terminen en / para que GitHub Pages no se pierda
  trailingSlash: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
