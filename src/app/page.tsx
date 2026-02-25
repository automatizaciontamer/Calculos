import CalculatorForm from "@/components/calculator/CalculatorForm";
import { Zap, ShieldCheck, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-primary tracking-tight">
              Electro<span className="text-accent">Calculadora</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Software de ingeniería para sistemas eléctricos industriales.
            </p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <div className="px-4 py-2 bg-white rounded-full shadow-sm border text-[10px] font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              NORMATIVA IEC ACTIVA
            </div>
          </div>
        </div>

        {/* Main Calculator Container */}
        <CalculatorForm />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Activity className="h-5 w-5" /> Marco Normativo Internacional
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Esta herramienta ha sido desarrollada bajo los estándares de la <strong>Comisión Electrotécnica Internacional (IEC)</strong>, asegurando que los cálculos de potencia, cables y climatización cumplan con las exigencias de la industria moderna.
            </p>
            <ul className="space-y-2 text-[13px] text-muted-foreground list-disc pl-5">
              <li><strong>IEC 60364:</strong> Instalaciones eléctricas en edificios y baja tensión.</li>
              <li><strong>IEC 60890:</strong> Verificación térmica de envolventes y tableros.</li>
              <li><strong>IEC 60947:</strong> Especificación para aparellaje de control y maniobra.</li>
              <li><strong>IEC 60228:</strong> Definición de conductores y secciones estándar.</li>
            </ul>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Parámetros de Seguridad
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
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
        <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t text-center text-muted-foreground text-[12px]">
          <p>© {new Date().getFullYear()} ElectroCalculadora. Ingeniería normalizada por estándares IEC internacionales.</p>
        </footer>
      </div>
    </main>
  );
}
