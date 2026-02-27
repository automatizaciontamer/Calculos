
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática necesaria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  /**
   * Ajuste inteligente de ruta:
   * - En desarrollo (Studio) usamos la raíz '/'
   * - En producción (GitHub) usamos '/Calculos'
   */
  basePath: process.env.NODE_ENV === 'production' ? '/Calculos' : '',
  
  images: {
    unoptimized: true,
  },

  // Obliga a que todas las rutas terminen en / para una mejor navegación estática
  trailingSlash: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
