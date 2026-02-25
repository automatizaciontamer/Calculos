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
  calculatePanelCooling,
  calculateStarDelta,
  CONDUCTIVITY 
} from "@/lib/electrical-formulas";
import { Zap, Activity, Ruler, ArrowDownToLine, RefreshCcw, Wind, Share2, Info } from "lucide-react";

export default function CalculatorForm() {
  const [activeTab, setActiveTab] = useState("potencia");
  const [system, setSystem] = useState<SystemType>("MONO");
  const [material, setMaterial] = useState<keyof typeof CONDUCTIVITY>("COBRE");
  
  // Inputs Generales
  const [v, setV] = useState("220");
  const [i, setI] = useState("10");
  const [p, setP] = useState("2200");
  const [pf, setPf] = useState("0.9");
  const [length, setLength] = useState("50");
  const [section, setSection] = useState("2.5");
  const [maxVd, setMaxVd] = useState("6.6");

  // Inputs Climatización
  const [panelW, setPanelW] = useState("800");
  const [panelH, setPanelH] = useState("1200");
  const [panelD, setPanelD] = useState("400");
  const [powerLoss, setPowerLoss] = useState("500");
  const [tInt, setTInt] = useState("35");
  const [tExt, setTExt] = useState("45");

  // Results
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setResult(null);
  }, [activeTab, system, material]);

  const handleCalculate = () => {
    const voltageNum = parseFloat(v) || 0;
    const currentNum = parseFloat(i) || 0;
    const powerNum = parseFloat(p) || 0;
    const pfNum = parseFloat(pf) || 1;
    const lengthNum = parseFloat(length) || 0;
    const sectionNum = parseFloat(section) || 0;
    const maxVdNum = parseFloat(maxVd) || 0;

    let res: any = 0;
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
      case "climatizacion":
        res = calculatePanelCooling(
          parseFloat(panelW),
          parseFloat(panelH),
          parseFloat(panelD),
          parseFloat(powerLoss),
          parseFloat(tInt),
          parseFloat(tExt)
        );
        break;
      case "estrella":
        res = calculateStarDelta(currentNum);
        break;
    }
    setResult(res);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg border-none bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="text-center pb-2 bg-primary/5 border-b mb-6">
          <CardTitle className="text-3xl font-black text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-accent fill-accent" />
            Centro de Ingeniería Eléctrica
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            Herramientas avanzadas para proyectos industriales y residenciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-muted/50 gap-1 rounded-xl mb-8">
              <TabsTrigger value="potencia" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-2 hidden md:block" /> Potencia
              </TabsTrigger>
              <TabsTrigger value="corriente" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2 hidden md:block" /> Corriente
              </TabsTrigger>
              <TabsTrigger value="seccion" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <Ruler className="h-4 w-4 mr-2 hidden md:block" /> Sección
              </TabsTrigger>
              <TabsTrigger value="caida" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <ArrowDownToLine className="h-4 w-4 mr-2 hidden md:block" /> Caída
              </TabsTrigger>
              <TabsTrigger value="climatizacion" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <Wind className="h-4 w-4 mr-2 hidden md:block" /> Aire Gabinete
              </TabsTrigger>
              <TabsTrigger value="estrella" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                <Share2 className="h-4 w-4 mr-2 hidden md:block" /> Y-Δ Motor
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Side */}
              <div className="space-y-4">
                {activeTab !== "climatizacion" && activeTab !== "estrella" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Sistema Eléctrico</Label>
                      <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                        <SelectTrigger className="border-primary/20">
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
                  </div>
                )}

                {activeTab === "climatizacion" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ancho Gabinete (mm)</Label>
                      <Input type="number" value={panelW} onChange={(e) => setPanelW(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Alto Gabinete (mm)</Label>
                      <Input type="number" value={panelH} onChange={(e) => setPanelH(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Profundidad (mm)</Label>
                      <Input type="number" value={panelD} onChange={(e) => setPanelD(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Calor Disipado Pv (W)</Label>
                      <Input type="number" value={powerLoss} onChange={(e) => setPowerLoss(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Temp. Interior Deseada (°C)</Label>
                      <Input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Temp. Exterior Máx (°C)</Label>
                      <Input type="number" value={tExt} onChange={(e) => setTExt(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab !== "estrella" && (
                      <div className="space-y-2">
                        <Label>Tensión (V)</Label>
                        <Input type="number" value={v} onChange={(e) => setV(e.target.value)} />
                      </div>
                    )}
                    
                    {(activeTab !== "corriente") && (
                      <div className="space-y-2">
                        <Label>Corriente {activeTab === "estrella" ? "Nominal" : ""}(A)</Label>
                        <Input type="number" value={i} onChange={(e) => setI(e.target.value)} />
                      </div>
                    )}

                    {activeTab === "corriente" && (
                      <div className="space-y-2">
                        <Label>Potencia (W)</Label>
                        <Input type="number" value={p} onChange={(e) => setP(e.target.value)} />
                      </div>
                    )}

                    {system !== "DC" && activeTab !== "estrella" && (
                      <div className="space-y-2">
                        <Label>Factor de Potencia (cos φ)</Label>
                        <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} />
                      </div>
                    )}

                    {(activeTab === "seccion" || activeTab === "caida") && (
                      <>
                        <div className="space-y-2">
                          <Label>Longitud (m)</Label>
                          <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Material</Label>
                          <Select value={material} onValueChange={(v) => setMaterial(v as keyof typeof CONDUCTIVITY)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COBRE">Cobre</SelectItem>
                              <SelectItem value="ALUMINIO">Aluminio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {activeTab === "caida" ? (
                          <div className="space-y-2">
                            <Label>Sección (mm²)</Label>
                            <Input type="number" value={section} onChange={(e) => setSection(e.target.value)} />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>ΔV Máx Permitida (V)</Label>
                            <Input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleCalculate} 
                  className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all mt-4"
                >
                  CALCULAR
                </Button>
              </div>

              {/* Results Side */}
              <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/10 min-h-[300px] flex flex-col items-center justify-center text-center">
                {result === null ? (
                  <div className="text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Complete los datos y presione calcular para ver los resultados técnicos.</p>
                  </div>
                ) : activeTab === "climatizacion" ? (
                  <div className="w-full space-y-6">
                    <div>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Potencia Refrigeración Requerida</p>
                      <h3 className="text-5xl font-black text-primary">
                        {result.coolingPower.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        <span className="text-2xl ml-2">W</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-left">
                        <span className="text-muted-foreground block">Área Gabinete:</span>
                        <span className="font-bold">{result.surfaceArea.toFixed(2)} m²</span>
                      </div>
                      <div className="text-left">
                        <span className="text-muted-foreground block">ΔT (Ti - Te):</span>
                        <span className="font-bold">{result.deltaT} °C</span>
                      </div>
                    </div>
                    {result.coolingPower > 0 ? (
                      <p className="text-xs text-destructive font-medium">Se requiere equipo de aire acondicionado o ventilación forzada.</p>
                    ) : (
                      <p className="text-xs text-green-600 font-medium">La disipación natural es suficiente para mantener la temperatura.</p>
                    )}
                  </div>
                ) : activeTab === "estrella" ? (
                  <div className="w-full space-y-6">
                    <div>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Ajuste Relé Térmico (Ir)</p>
                      <h3 className="text-5xl font-black text-primary">
                        {result.relaySetting.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-2xl ml-2">A</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-muted-foreground">Contactor Principal (KM1):</span>
                        <span className="font-bold text-primary">{result.contactorMain.toFixed(2)} A</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-muted-foreground">Contactor Triángulo (KM2):</span>
                        <span className="font-bold text-primary">{result.contactorDelta.toFixed(2)} A</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-muted-foreground">Contactor Estrella (KM3):</span>
                        <span className="font-bold text-primary">{result.contactorStar.toFixed(2)} A</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Resultado Obtenido</p>
                    <h3 className="text-6xl font-black text-primary">
                      {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '0'}
                      <span className="text-2xl ml-2 text-primary/80">
                        {activeTab === "potencia" ? "W" : 
                         activeTab === "corriente" ? "A" : 
                         activeTab === "seccion" ? "mm²" : "V"}
                      </span>
                    </h3>
                    <div className="pt-4 mt-4 border-t border-primary/10 grid grid-cols-2 gap-4 text-xs text-muted-foreground text-left">
                      <div><strong>Sistema:</strong> {system}</div>
                      <div><strong>Tensión:</strong> {v}V</div>
                      {system !== "DC" && <div><strong>PF:</strong> {pf}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Industrial Reference Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary text-primary-foreground p-6 rounded-2xl">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Info className="h-5 w-5" /> Nota Técnica: Estrella-Triángulo
          </h4>
          <p className="text-sm opacity-90 leading-relaxed">
            El arranque Y-Δ reduce la corriente de arranque a 1/3 de la nominal. El relé térmico debe colocarse en serie con las fases del motor (dentro del lazo) y ajustarse a 0.58 x Inom.
          </p>
        </Card>
        <Card className="bg-accent text-accent-foreground p-6 rounded-2xl">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Wind className="h-5 w-5" /> Guía de Climatización
          </h4>
          <p className="text-sm opacity-90 leading-relaxed">
            Si la temperatura exterior es mayor a la interior (ΔT negativo), el gabinete absorbe calor del ambiente. Asegúrese de incluir las pérdidas de potencia (Pv) de todos los variadores, PLC y fuentes.
          </p>
        </Card>
      </div>
    </div>
  );
}
