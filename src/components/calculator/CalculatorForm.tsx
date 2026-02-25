"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SystemType, 
  calculatePower, 
  calculateCurrent, 
  calculateVoltageDrop, 
  calculateCableSection, 
  CONDUCTIVITY 
} from "@/lib/electrical-formulas";
import { Zap, Activity, Ruler, ArrowDownToLine, RefreshCcw } from "lucide-react";

export default function CalculatorForm() {
  const [activeTab, setActiveTab] = useState("potencia");
  const [system, setSystem] = useState<SystemType>("MONO");
  const [material, setMaterial] = useState<keyof typeof CONDUCTIVITY>("COBRE");
  
  // Inputs
  const [v, setV] = useState("220");
  const [i, setI] = useState("10");
  const [p, setP] = useState("2200");
  const [pf, setPf] = useState("0.9");
  const [length, setLength] = useState("50");
  const [section, setSection] = useState("2.5");
  const [maxVd, setMaxVd] = useState("6.6"); // 3% of 220V

  // Results
  const [result, setResult] = useState<number | null>(null);

  const resetValues = () => {
    setResult(null);
  };

  useEffect(() => {
    resetValues();
  }, [activeTab, system, material]);

  const handleCalculate = () => {
    const voltageNum = parseFloat(v) || 0;
    const currentNum = parseFloat(i) || 0;
    const powerNum = parseFloat(p) || 0;
    const pfNum = parseFloat(pf) || 1;
    const lengthNum = parseFloat(length) || 0;
    const sectionNum = parseFloat(section) || 0;
    const maxVdNum = parseFloat(maxVd) || 0;

    let res = 0;
    switch (activeTab) {
      case "potencia":
        res = calculatePower(voltageNum, currentNum, system, system === 'DC' ? 1 : pfNum);
        break;
      case "corriente":
        res = calculateCurrent(powerNum, voltageNum, system, system === 'DC' ? 1 : pfNum);
        break;
      case "seccion":
        res = calculateCableSection(currentNum, lengthNum, maxVdNum, system, material, system === 'DC' ? 1 : pfNum);
        break;
      case "caida":
        res = calculateVoltageDrop(currentNum, lengthNum, sectionNum, system, material, system === 'DC' ? 1 : pfNum);
        break;
    }
    setResult(res);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg border-none bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-accent" />
            ElectroCalculadora
          </CardTitle>
          <CardDescription className="text-lg">
            Herramienta profesional para cálculos eléctricos precisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label className="text-base">Sistema Eléctrico</Label>
              <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                <SelectTrigger className="h-12 border-primary/20">
                  <SelectValue placeholder="Seleccione sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DC">Corriente Continua (DC)</SelectItem>
                  <SelectItem value="MONO">C.A. Monofásica (1F+N)</SelectItem>
                  <SelectItem value="BI">C.A. Bifásica (2F)</SelectItem>
                  <SelectItem value="TRI">C.A. Trifásica (3F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(activeTab === "seccion" || activeTab === "caida") && (
              <div className="space-y-2">
                <Label className="text-base">Material del Conductor</Label>
                <Select value={material} onValueChange={(v) => setMaterial(v as keyof typeof CONDUCTIVITY)}>
                  <SelectTrigger className="h-12 border-primary/20">
                    <SelectValue placeholder="Seleccione material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COBRE">Cobre (Cu)</SelectItem>
                    <SelectItem value="ALUMINIO">Aluminio (Al)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 gap-1 rounded-xl">
              <TabsTrigger value="potencia" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Zap className="h-4 w-4 mr-2" /> Potencia
              </TabsTrigger>
              <TabsTrigger value="corriente" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Activity className="h-4 w-4 mr-2" /> Corriente
              </TabsTrigger>
              <TabsTrigger value="seccion" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Ruler className="h-4 w-4 mr-2" /> Sección
              </TabsTrigger>
              <TabsTrigger value="caida" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <ArrowDownToLine className="h-4 w-4 mr-2" /> Caída
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Common Fields */}
              <div className="space-y-2">
                <Label>Tensión (V) - Voltios</Label>
                <Input type="number" value={v} onChange={(e) => setV(e.target.value)} className="h-11" placeholder="Ej: 220" />
              </div>

              {activeTab !== "corriente" && (
                <div className="space-y-2">
                  <Label>Corriente (I) - Amperios</Label>
                  <Input type="number" value={i} onChange={(e) => setI(e.target.value)} className="h-11" placeholder="Ej: 10" />
                </div>
              )}

              {activeTab === "corriente" && (
                <div className="space-y-2">
                  <Label>Potencia (P) - Vatios (W)</Label>
                  <Input type="number" value={p} onChange={(e) => setP(e.target.value)} className="h-11" placeholder="Ej: 2200" />
                </div>
              )}

              {system !== "DC" && (
                <div className="space-y-2">
                  <Label>Factor de Potencia (cos φ)</Label>
                  <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="h-11" placeholder="0.0 a 1.0" />
                </div>
              )}

              {(activeTab === "seccion" || activeTab === "caida") && (
                <>
                  <div className="space-y-2">
                    <Label>Longitud del Cable (L) - Metros</Label>
                    <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="h-11" placeholder="Ej: 50" />
                  </div>
                  {activeTab === "caida" ? (
                    <div className="space-y-2">
                      <Label>Sección del Cable (S) - mm²</Label>
                      <Input type="number" value={section} onChange={(e) => setSection(e.target.value)} className="h-11" placeholder="Ej: 2.5" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Máx. Caída permitida (ΔV) - Voltios</Label>
                      <Input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} className="h-11" placeholder="Ej: 6.6" />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-6">
              <Button 
                onClick={handleCalculate} 
                className="w-full md:w-64 h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all"
              >
                CALCULAR AHORA
              </Button>

              {result !== null && (
                <div className="w-full p-6 bg-primary/5 rounded-2xl border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground font-medium uppercase tracking-wider">Resultado obtenido</p>
                    <h3 className="text-4xl font-black text-primary">
                      {result.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                      <span className="text-2xl ml-2 text-primary/80">
                        {activeTab === "potencia" ? "W" : 
                         activeTab === "corriente" ? "A" : 
                         activeTab === "seccion" ? "mm²" : "V"}
                      </span>
                    </h3>
                    <div className="mt-4 pt-4 border-t border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <strong>Sistema:</strong> {system === 'DC' ? 'C. Continua' : system === 'MONO' ? 'Monofásico' : system === 'BI' ? 'Bifásico' : 'Trifásico'}
                      </div>
                      <div>
                        <strong>Tensión:</strong> {v} V
                      </div>
                      {system !== 'DC' && (
                        <div>
                          <strong>FP (cos φ):</strong> {pf}
                        </div>
                      )}
                      {(activeTab === "seccion" || activeTab === "caida") && (
                        <div>
                          <strong>Material:</strong> {material}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="p-4 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Precisión Técnica</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
            Basado en normas internacionales para sistemas de baja tensión.
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="p-4 flex flex-row items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <RefreshCcw className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-base font-semibold">Multisistema</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
            Soporta DC y AC (Monofásica, Bifásica y Trifásica).
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="p-4 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ruler className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Dimensionamiento</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
            Cálculo de secciones normalizadas y caída de tensión por longitud.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}