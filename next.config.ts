import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // CONFIGURACIÓN PARA https://github.com/automatizaciontamer/studio
  basePath: '/studio',
  
  images: {
    unoptimized: true,
  },

  // Obliga a que todas las rutas terminen en / para que GitHub Pages las encuentre
  trailingSlash: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
