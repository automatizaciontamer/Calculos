import CalculatorForm from "@/components/calculator/CalculatorForm";
import { Zap, ShieldCheck, Activity, BookOpen, Layers, HardHat, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
              Tamer <span className="text-accent">Ind. S.A.</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-xl">
              Software para asistencia en cálculos de ingeniería y diseño de tableros eléctricos.
            </p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end shrink-0">
            <div className="px-3 md:px-4 py-2 bg-white rounded-full shadow-sm border text-[10px] md:text-xs font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SISTEMA NORMALIZADO IEC / ISO
            </div>
          </div>
        </div>

        {/* Main Calculator Container */}
        <div className="max-w-5xl mx-auto">
          <CalculatorForm />
        </div>

        {/* Technical Standards Section */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Diseño y Fabricación */}
          <div className="space-y-4 bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">Diseño y Fabricación</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Cumplimiento estricto de la serie <strong>IEC 61439</strong> para conjuntos de aparamenta de baja tensión.
            </p>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 61439-1:</strong> Reglas generales.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 61439-2:</strong> Conjuntos de potencia.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60204-1:</strong> Seguridad de máquinas.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60529:</strong> Grados de protección IP.
              </li>
            </ul>
          </div>

          {/* Seguridad y Envolventes */}
          <div className="space-y-4 bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-2">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-primary">Seguridad y Envolventes</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Garantía de protección mecánica y térmica según estándares de resistencia industrial.
            </p>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 62262:</strong> Protección IK (Impactos).
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60890:</strong> Verificación térmica.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IP 54/65:</strong> Estanqueidad industrial.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>Forma 1-4:</strong> Segregación interna.
              </li>
            </ul>
          </div>

          {/* Instalaciones y Cableado */}
          <div className="space-y-4 bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">Instalaciones y Cableado</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Dimensionamiento de conductores y protecciones bajo normativa de baja tensión.
            </p>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60364:</strong> Instalaciones eléctricas.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60228:</strong> Conductores estándar.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60947:</strong> Aparamenta de maniobra.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-accent" /> <strong>IEC 60445:</strong> Identificación bornes/colores.
              </li>
            </ul>
          </div>

        </div>

        {/* Summary Banner */}
        <div className="max-w-5xl mx-auto mt-12 p-8 bg-primary text-white rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <HardHat className="h-8 w-8 text-accent" /> Compromiso de Calidad Tamer
            </h2>
            <p className="text-primary-foreground/90 text-sm max-w-2xl leading-relaxed">
              Cada cálculo realizado por este software utiliza algoritmos basados en las curvas de respuesta y coeficientes de seguridad exigidos por las normas internacionales, minimizando el riesgo de fallas por sobrecalentamiento, caídas de tensión o fallos de aislamiento en tableros de automatización.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Certificación</p>
              <p className="text-3xl font-black">IEC 61439</p>
              <p className="text-[10px] text-white/70">Diseño Verificado</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t text-center text-muted-foreground text-[12px] px-4 pb-12">
          <div className="flex justify-center gap-6 mb-4">
            <span className="font-bold">IEC</span>
            <span className="font-bold">ISO</span>
            <span className="font-bold">IRAM</span>
            <span className="font-bold">DIN</span>
          </div>
          <p>© {new Date().getFullYear()} Tamer Industrial S.A. Todos los derechos reservados. Ingeniería industrial bajo estándares internacionales.</p>
        </footer>
      </div>
    </main>
  );
}
