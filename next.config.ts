import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática necesaria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // Ajuste automático: usa /Calculos en producción (GitHub) y raíz en desarrollo (Studio)
  basePath: process.env.NODE_ENV === 'production' ? '/Calculos' : '',
  
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
