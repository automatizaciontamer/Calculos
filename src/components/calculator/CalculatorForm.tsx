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
  InstallationType,
  MATERIAL_K,
  calculatePower, 
  calculateCurrent, 
  calculateVoltageDrop, 
  calculateCableSection, 
  calculatePanelCooling,
  calculateStarDelta,
  CONDUCTIVITY 
} from "@/lib/electrical-formulas";
import { Zap, Activity, Ruler, ArrowDownToLine, Wind, Share2, Info, Box } from "lucide-react";

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
  const [otherPowerLoss, setOtherPowerLoss] = useState("100");
  const [vfdCount, setVfdCount] = useState("1");
  const [vfdPowerKw, setVfdPowerKw] = useState("7.5");
  const [tInt, setTInt] = useState("35");
  const [tExt, setTExt] = useState("45");
  const [panelMaterial, setPanelMaterial] = useState<keyof typeof MATERIAL_K>("CHAPA_PINTADA");
  const [installation, setInstallation] = useState<InstallationType>("WALL");

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

    let res: any = null;
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
          parseFloat(otherPowerLoss),
          parseFloat(vfdCount),
          parseFloat(vfdPowerKw),
          parseFloat(tInt),
          parseFloat(tExt),
          panelMaterial,
          installation
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
            Herramientas de precisión para sistemas industriales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-muted/50 gap-1 rounded-xl mb-8">
              <TabsTrigger value="potencia" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Potencia</TabsTrigger>
              <TabsTrigger value="corriente" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Corriente</TabsTrigger>
              <TabsTrigger value="seccion" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Sección</TabsTrigger>
              <TabsTrigger value="caida" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Caída</TabsTrigger>
              <TabsTrigger value="climatizacion" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Clima</TabsTrigger>
              <TabsTrigger value="estrella" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Y-Δ</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Side */}
              <div className="space-y-4">
                {activeTab !== "climatizacion" && activeTab !== "estrella" && (
                  <div className="space-y-2">
                    <Label>Sistema Eléctrico</Label>
                    <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DC">DC</SelectItem>
                        <SelectItem value="MONO">Monofásico</SelectItem>
                        <SelectItem value="BI">Bifásico</SelectItem>
                        <SelectItem value="TRI">Trifásico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeTab === "climatizacion" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Material del Tablero</Label>
                      <Select value={panelMaterial} onValueChange={(v) => setPanelMaterial(v as keyof typeof MATERIAL_K)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHAPA_PINTADA">Chapa de Acero Pintada</SelectItem>
                          <SelectItem value="ACERO_INOX">Acero Inoxidable</SelectItem>
                          <SelectItem value="ALUMINIO">Aluminio</SelectItem>
                          <SelectItem value="PLASTICO">Poliéster / Plástico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Tipo de Instalación</Label>
                      <Select value={installation} onValueChange={(v) => setInstallation(v as InstallationType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">Exento (Todas las caras libres)</SelectItem>
                          <SelectItem value="WALL">Contra pared (Espalda cubierta)</SelectItem>
                          <SelectItem value="ROW">En batería (Lados cubiertos)</SelectItem>
                          <SelectItem value="RECESSED">Empotrado (Solo frontal libre)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cant. Variadores</Label>
                      <Input type="number" value={vfdCount} onChange={(e) => setVfdCount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Potencia VFD (kW)</Label>
                      <Input type="number" value={vfdPowerKw} onChange={(e) => setVfdPowerKw(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Ancho (mm)</Label>
                      <Input type="number" value={panelW} onChange={(e) => setPanelW(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Alto (mm)</Label>
                      <Input type="number" value={panelH} onChange={(e) => setPanelH(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Otras Pérdidas (W)</Label>
                      <Input type="number" value={otherPowerLoss} onChange={(e) => setOtherPowerLoss(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Profundidad (mm)</Label>
                      <Input type="number" value={panelD} onChange={(e) => setPanelD(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>T. Interior Deseada (°C)</Label>
                      <Input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>T. Exterior Máx (°C)</Label>
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
                    <div className="space-y-2">
                      <Label>Corriente {activeTab === "estrella" ? "Nominal" : ""}(A)</Label>
                      <Input type="number" value={i} onChange={(e) => setI(e.target.value)} />
                    </div>
                    {activeTab === "corriente" && (
                      <div className="space-y-2">
                        <Label>Potencia (W)</Label>
                        <Input type="number" value={p} onChange={(e) => setP(e.target.value)} />
                      </div>
                    )}
                    {system !== "DC" && activeTab !== "estrella" && (
                      <div className="space-y-2">
                        <Label>cos φ</Label>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                            <Label>ΔV Máx (V)</Label>
                            <Input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <Button onClick={handleCalculate} className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-lg">
                  CALCULAR
                </Button>
              </div>

              {/* Results Side */}
              <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/10 flex flex-col items-center justify-center text-center">
                {result === null ? (
                  <div className="text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Ingrese los datos técnicos para obtener resultados.</p>
                  </div>
                ) : activeTab === "climatizacion" && typeof result === 'object' && 'coolingPower' in result ? (
                  <div className="w-full space-y-4">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Potencia Frigorífica Requerida</p>
                    <h3 className="text-5xl font-black text-primary">
                      {result.coolingPower?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      <span className="text-2xl ml-2">W</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-left">
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Pérdida VFD:</span>
                        <span className="font-bold">{result.vfdLosses?.toFixed(1)} W</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Pérdida Total (Pv):</span>
                        <span className="font-bold">{result.totalPowerLoss?.toFixed(1)} W</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Sup. Efectiva (A):</span>
                        <span className="font-bold">{result.surfaceArea?.toFixed(2)} m²</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">ΔT (Ti - Te):</span>
                        <span className="font-bold">{result.deltaT} °C</span>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "estrella" && typeof result === 'object' && 'relaySetting' in result ? (
                  <div className="w-full space-y-4">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Ajuste Relé Térmico</p>
                    <h3 className="text-5xl font-black text-primary">
                      {result.relaySetting?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      <span className="text-2xl ml-2">A</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2 mt-4 text-sm">
                      <div className="flex justify-between p-2 bg-white rounded border">
                        <span>Contactor Delta (KM2):</span>
                        <span className="font-bold">{result.contactorDelta?.toFixed(1)} A</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded border">
                        <span>Contactor Estrella (KM3):</span>
                        <span className="font-bold">{result.contactorStar?.toFixed(1)} A</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Resultado</p>
                    <h3 className="text-6xl font-black text-primary">
                      {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '0'}
                      <span className="text-2xl ml-2 text-primary/80">
                        {activeTab === "potencia" ? "W" : activeTab === "corriente" ? "A" : activeTab === "seccion" ? "mm²" : "V"}
                      </span>
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-muted/30 border-dashed flex gap-3">
          <Box className="h-6 w-6 text-primary shrink-0" />
          <div className="text-sm">
            <h5 className="font-bold">Nota sobre Instalación</h5>
            <p className="text-muted-foreground">El tipo de instalación afecta la superficie de disipación (A). Los gabinetes empotrados disipan menos calor que los exentos.</p>
          </div>
        </Card>
        <Card className="p-4 bg-muted/30 border-dashed flex gap-3">
          <Wind className="h-6 w-6 text-accent shrink-0" />
          <div className="text-sm">
            <h5 className="font-bold">Carga de Variadores</h5>
            <p className="text-muted-foreground">Se asume una pérdida promedio del 3% para variadores estándar. Esto incluye las pérdidas por conmutación y resistencia interna.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
