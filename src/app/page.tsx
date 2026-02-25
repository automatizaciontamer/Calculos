import CalculatorForm from "@/components/calculator/CalculatorForm";
import { Zap } from "lucide-react";

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
              Solución integral para ingenieros y electricistas.
            </p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <div className="px-4 py-2 bg-white rounded-full shadow-sm border text-xs font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SISTEMA OPERATIVO
            </div>
          </div>
        </div>

        {/* Main Calculator Container */}
        <CalculatorForm />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Zap className="h-5 w-5" /> ¿Cómo usar esta herramienta?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Seleccione el tipo de cálculo que desea realizar en las pestañas superiores. Asegúrese de elegir el sistema eléctrico correcto (Monofásico, Trifásico, etc.) ya que las fórmulas cambian significativamente.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Use <strong>Factor de Potencia</strong> entre 0.8 y 0.9 para motores típicos.</li>
              <li>La <strong>Caída de Tensión</strong> máxima recomendada es del 3% al 5%.</li>
              <li>Para sistemas <strong>DC</strong>, el factor de potencia es siempre 1.0.</li>
            </ul>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="font-bold mb-4 text-primary">Unidades de Medida</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="block font-bold text-primary">P (W)</span>
                Vatios / Watts
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="block font-bold text-primary">I (A)</span>
                Amperios
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="block font-bold text-primary">V (V)</span>
                Voltios
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="block font-bold text-primary">S (mm²)</span>
                Milímetros²
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} ElectroCalculadora. Diseñado para precisión técnica.</p>
        </footer>
      </div>
    </main>
  );
}