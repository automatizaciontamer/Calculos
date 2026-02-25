import CalculatorForm from "@/components/calculator/CalculatorForm";
import { Zap, ShieldCheck, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
              Electro<span className="text-accent">Calculadora</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-xl">
              Software de ingeniería para diseño y normalización de sistemas industriales y electromecánicos.
            </p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end shrink-0">
            <div className="px-3 md:px-4 py-2 bg-white rounded-full shadow-sm border text-[10px] md:text-xs font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              NORMATIVA IEC ACTIVA
            </div>
          </div>
        </div>

        {/* Main Calculator Container */}
        <div className="max-w-5xl mx-auto">
          <CalculatorForm />
        </div>

        {/* Info Section */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Activity className="h-5 w-5" /> Marco Normativo Internacional
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Esta herramienta ha sido desarrollada bajo los estándares de la <strong>Comisión Electrotécnica Internacional (IEC)</strong>, asegurando que los cálculos de potencia, conductores y climatización cumplan con las exigencias de la industria moderna.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-muted-foreground list-none">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">/</span> <strong>IEC 60364:</strong> Instalaciones en baja tensión.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">/</span> <strong>IEC 60890:</strong> Verificación térmica.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">/</span> <strong>IEC 60947:</strong> Control y maniobra.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">/</span> <strong>IEC 60228:</strong> Conductores estándar.
              </li>
            </ul>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Parámetros de Seguridad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <span className="block font-bold text-primary">Factor de Seguridad</span>
                1.25x para motores (IEC)
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <span className="block font-bold text-primary">Temp. Referencia</span>
                30°C Ambiente / 70°C PVC
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <span className="block font-bold text-primary">Caída Admisible</span>
                3% (Alumbrado) - 5% (Fuerza)
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <span className="block font-bold text-primary">Tensión Nominal</span>
                230V/400V (IEC 60038)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto mt-16 pt-8 border-t text-center text-muted-foreground text-[11px] md:text-[12px] px-4">
          <p>© {new Date().getFullYear()} ElectroCalculadora. Ingeniería industrial normalizada por estándares internacionales.</p>
        </footer>
      </div>
    </main>
  );
}
