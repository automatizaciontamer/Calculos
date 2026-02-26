import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Exportación estática necesaria para GitHub Pages
  output: 'export',
  distDir: 'out',
  
  // IMPORTANTE: Este basePath debe coincidir con el nombre de tu repositorio en GitHub
  // Si tu repo se llama "studio", mantenlo así.
  // En desarrollo (Studio), Next.js detectará esta ruta automáticamente.
  basePath: '/studio',
  
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
