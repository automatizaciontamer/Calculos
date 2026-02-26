import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamer Industrial S.A. | Cálculos Automatizacion',
  description: 'Calculadora de potencia, corriente, sección de cable y caída de tensión para sistemas DC, Monofásicos y Trifásicos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}