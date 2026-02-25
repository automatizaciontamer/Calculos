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
  calculateTransmission,
  TransmissionStage,
  CONDUCTIVITY 
} from "@/lib/electrical-formulas";
import { Zap, Activity, Ruler, Info, Box, ShieldCheck, ThermometerSnowflake, Settings2, Plus, Trash2, ArrowRightLeft } from "lucide-react";

export default function CalculatorForm() {
  const [activeTab, setActiveTab] = useState("potencia");
  const [system, setSystem] = useState<SystemType>("MONO");
  const [material, setMaterial] = useState<keyof typeof CONDUCTIVITY>("COBRE");
  
  // Inputs Generales
  const [v, setV] = useState("380");
  const [i, setI] = useState("10");
  const [p, setP] = useState("7500");
  const [pf, setPf] = useState("0.85");
  const [eff, setEff] = useState("90");
  const [length, setLength] = useState("50");
  const [section, setSection] = useState("2.5");
  const [maxVd, setMaxVd] = useState("11.4");

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

  // Inputs Transmisión
  const [transSpeed, setTransSpeed] = useState("1450");
  const [transMode, setTransMode] = useState<'FORWARD' | 'REVERSE'>('FORWARD');
  const [transStages, setTransStages] = useState<TransmissionStage[]>([{ input: 10, output: 40 }]);

  // Results
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setResult(null);
  }, [activeTab, system, material]);

  const handleAddStage = () => {
    setTransStages([...transStages, { input: 10, output: 10 }]);
  };

  const handleRemoveStage = (index: number) => {
    setTransStages(transStages.filter((_, i) => i !== index));
  };

  const handleUpdateStage = (index: number, field: 'input' | 'output', value: string) => {
    const newStages = [...transStages];
    newStages[index][field] = parseFloat(value) || 0;
    setTransStages(newStages);
  };

  const handleCalculate = () => {
    const voltageNum = parseFloat(v) || 0;
    const currentNum = parseFloat(i) || 0;
    const powerNum = parseFloat(p) || 0;
    const pfNum = parseFloat(pf) || 1;
    const effNum = parseFloat(eff) || 100;
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
        res = calculateStarDelta(powerNum, voltageNum, pfNum, effNum);
        break;
      case "transmision":
        res = calculateTransmission(parseFloat(transSpeed), transStages, transMode);
        break;
    }
    setResult(res);
  };

  const getNormativeReference = () => {
    switch(activeTab) {
      case "seccion":
      case "caida":
        return "IEC 60364-5-52";
      case "climatizacion":
        return "IEC 60890";
      case "estrella":
        return "IEC 60947-4-1";
      case "transmision":
        return "ISO 6336 / DIN 3960";
      default:
        return "IEC 60038 / 60364";
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-2xl border-none bg-card/80 backdrop-blur-md overflow-hidden rounded-3xl">
        <CardHeader className="text-center pb-6 bg-primary/5 border-b mb-6 relative px-4 md:px-8">
          <div className="hidden sm:flex absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full items-center gap-1.5 shadow-sm">
            <ShieldCheck className="h-3 w-3" /> {getNormativeReference()}
          </div>
          <CardTitle className="text-2xl md:text-3xl font-black text-primary flex flex-col md:flex-row items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-accent fill-accent" />
            Ingeniería Industrial IEC
          </CardTitle>
          <CardDescription className="text-sm md:text-base font-medium">
            Dimensionamiento profesional de sistemas eléctricos y transmisiones mecánicas
          </CardDescription>
          <div className="sm:hidden mt-2 inline-flex bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> {getNormativeReference()}
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 h-auto p-1.5 bg-muted/50 gap-1.5 rounded-2xl mb-8 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="potencia" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Potencia</TabsTrigger>
              <TabsTrigger value="corriente" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Corriente</TabsTrigger>
              <TabsTrigger value="seccion" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Sección</TabsTrigger>
              <TabsTrigger value="caida" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Caída</TabsTrigger>
              <TabsTrigger value="climatizacion" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Clima</TabsTrigger>
              <TabsTrigger value="estrella" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Y-Δ</TabsTrigger>
              <TabsTrigger value="transmision" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Mecánica</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Form Side */}
              <div className="lg:col-span-3 space-y-6">
                {activeTab !== "climatizacion" && activeTab !== "estrella" && activeTab !== "transmision" && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Sistema Eléctrico (IEC 60038)</Label>
                    <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DC">DC (Continuo)</SelectItem>
                        <SelectItem value="MONO">230V Monofásico</SelectItem>
                        <SelectItem value="BI">400V Bifásico</SelectItem>
                        <SelectItem value="TRI">400V Trifásico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeTab === "transmision" ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Modo de Cálculo</Label>
                        <Select value={transMode} onValueChange={(v) => setTransMode(v as any)}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FORWARD">Calcular Velocidad Salida</SelectItem>
                            <SelectItem value="REVERSE">Calcular Velocidad Motor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">{transMode === 'FORWARD' ? 'RPM Motor' : 'RPM Salida Req.'}</Label>
                        <Input type="number" value={transSpeed} onChange={(e) => setTransSpeed(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-primary font-bold">Etapas de Transmisión</Label>
                        <Button variant="outline" size="sm" onClick={handleAddStage} className="h-8 gap-1.5 rounded-full text-xs">
                          <Plus className="h-3 w-3" /> Nueva Etapa
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {transStages.map((stage, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-end gap-3 p-4 bg-muted/20 rounded-2xl border border-primary/5">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Entrada (Z1 / D1)</Label>
                              <Input 
                                type="number" 
                                value={stage.input} 
                                onChange={(e) => handleUpdateStage(idx, 'input', e.target.value)} 
                                className="h-10 rounded-lg bg-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Salida (Z2 / D2)</Label>
                              <Input 
                                type="number" 
                                value={stage.output} 
                                onChange={(e) => handleUpdateStage(idx, 'output', e.target.value)} 
                                className="h-10 rounded-lg bg-white"
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveStage(idx)} 
                              className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg"
                              disabled={transStages.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : activeTab === "climatizacion" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Material (IEC 60890)</Label>
                      <Select value={panelMaterial} onValueChange={(v) => setPanelMaterial(v as keyof typeof MATERIAL_K)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHAPA_PINTADA">Chapa de Acero (k=5.5)</SelectItem>
                          <SelectItem value="ACERO_INOX">Acero Inoxidable (k=3.7)</SelectItem>
                          <SelectItem value="ALUMINIO">Aluminio (k=12.0)</SelectItem>
                          <SelectItem value="PLASTICO">Plástico/Poliéster (k=3.5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tipo de Instalación</Label>
                      <Select value={installation} onValueChange={(v) => setInstallation(v as InstallationType)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">Exento (6 caras libres)</SelectItem>
                          <SelectItem value="WALL">Contra pared (5 caras libres)</SelectItem>
                          <SelectItem value="ROW">En fila (4 caras libres)</SelectItem>
                          <SelectItem value="RECESSED">Empotrado (1 cara libre)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Cant. VFDs</Label>
                      <Input type="number" value={vfdCount} onChange={(e) => setVfdCount(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia VFD (kW)</Label>
                      <Input type="number" value={vfdPowerKw} onChange={(e) => setVfdPowerKw(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Ancho (mm)</Label>
                      <Input type="number" value={panelW} onChange={(e) => setPanelW(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Alto (mm)</Label>
                      <Input type="number" value={panelH} onChange={(e) => setPanelH(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Otras Cargas (W)</Label>
                      <Input type="number" value={otherPowerLoss} onChange={(e) => setOtherPowerLoss(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Profundo (mm)</Label>
                      <Input type="number" value={panelD} onChange={(e) => setPanelD(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Int Deseada (°C)</Label>
                      <Input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Ext Máx (°C)</Label>
                      <Input type="number" value={tExt} onChange={(e) => setTExt(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                  </div>
                ) : activeTab === "estrella" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia (W)</Label>
                      <Input type="number" value={p} onChange={(e) => setP(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tensión (V)</Label>
                      <Input type="number" value={v} onChange={(e) => setV(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">cos φ (Nominal)</Label>
                      <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Rendimiento η (%)</Label>
                      <Input type="number" value={eff} onChange={(e) => setEff(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tensión (V)</Label>
                      <Input type="number" value={v} onChange={(e) => setV(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Corriente (A)</Label>
                      <Input type="number" value={i} onChange={(e) => setI(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    {activeTab === "corriente" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia (W)</Label>
                        <Input type="number" value={p} onChange={(e) => setP(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                    )}
                    {system !== "DC" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Factor de Potencia</Label>
                        <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                    )}
                    {(activeTab === "seccion" || activeTab === "caida") && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">Longitud (m)</Label>
                          <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">Conductor (IEC 60228)</Label>
                          <Select value={material} onValueChange={(v) => setMaterial(v as keyof typeof CONDUCTIVITY)}>
                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COBRE">Cobre electrolítico</SelectItem>
                              <SelectItem value="ALUMINIO">Aluminio industrial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {activeTab === "caida" ? (
                          <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">Sección (mm²)</Label>
                            <Input type="number" value={section} onChange={(e) => setSection(e.target.value)} className="h-11 rounded-xl" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">ΔV Admisible (V)</Label>
                            <Input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} className="h-11 rounded-xl" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <Button onClick={handleCalculate} className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-black text-base md:text-lg shadow-xl rounded-2xl transition-all active:scale-95 group">
                  EJECUTAR CÁLCULO INGENIERÍA
                  <ArrowRightLeft className="h-5 w-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
                </Button>
              </div>

              {/* Results Side */}
              <div className="lg:col-span-2 bg-primary/[0.03] rounded-3xl p-6 md:p-8 border-2 border-primary/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                {result === null ? (
                  <div className="text-muted-foreground relative z-10 py-12">
                    <Info className="h-16 w-16 mx-auto mb-6 text-primary/20" />
                    <p className="text-sm font-medium px-4">Complete los parámetros técnicos para generar el informe basado en normativa IEC.</p>
                  </div>
                ) : activeTab === "transmision" && typeof result === 'object' && 'resultSpeed' in result ? (
                  <div className="w-full space-y-6 relative z-10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Settings2 className="h-4 w-4" /> {transMode === 'FORWARD' ? 'VELOCIDAD FINAL CALCULADA' : 'VELOCIDAD REQUERIDA MOTOR'}
                    </p>
                    <div className="space-y-1">
                      <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums">
                        {result.resultSpeed?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </h3>
                      <span className="text-xl md:text-2xl font-bold text-primary/60">RPM</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-8">
                      <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Relación de Transmisión Total (I)</span>
                        <span className="text-3xl font-black text-accent">1 : {result.totalRatio?.toFixed(2)}</span>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">Factor de desmultiplicación acumulado</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-xl border border-dashed text-[11px] flex justify-between items-center px-4">
                        <span className="text-muted-foreground font-medium">Etapas procesadas:</span>
                        <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{result.stagesCount}</span>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "climatizacion" && typeof result === 'object' && 'coolingPower' in result ? (
                  <div className="w-full space-y-6 relative z-10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <ThermometerSnowflake className="h-4 w-4" /> POTENCIA FRIGORÍFICA REQUERIDA
                    </p>
                    <div className="space-y-1">
                      <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums">
                        {result.coolingPower?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </h3>
                      <span className="text-xl md:text-2xl font-bold text-primary/60">W</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-8 text-left">
                      <div className="bg-white p-3 rounded-xl border shadow-sm col-span-2">
                        <span className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Pérdidas Totales Disipadas (Pv)</span>
                        <span className="text-lg font-black text-primary">{result.totalPowerLoss?.toFixed(1)} W</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border shadow-sm">
                        <span className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Superficie (A)</span>
                        <span className="text-sm font-bold text-accent">{result.surfaceArea?.toFixed(2)} m²</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border shadow-sm">
                        <span className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">ΔT Térmico</span>
                        <span className="text-sm font-bold text-accent">{result.deltaT} °C</span>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "estrella" && typeof result === 'object' && 'relaySetting' in result ? (
                  <div className="w-full space-y-6 relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">CORRIENTE NOMINAL (In)</p>
                      <h3 className="text-4xl md:text-5xl font-black text-primary tabular-nums">
                        {result.nominalCurrent?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-xl ml-2 text-primary/60">A</span>
                      </h3>
                    </div>
                    
                    <div className="p-6 bg-white rounded-2xl border-2 border-accent/20 shadow-lg scale-105">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">AJUSTE RELÉ TÉRMICO (Ir)</p>
                      <h3 className="text-5xl md:text-6xl font-black text-accent tabular-nums">
                        {result.relaySetting?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-2xl ml-2">A</span>
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-tight">PROTECCIÓN BASADA EN CORRIENTE DE FASE</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase border-b pb-2 flex items-center justify-between tracking-wider">
                          <span>CONDUCTORES (IEC 60364)</span>
                          <Ruler className="h-4 w-4 text-primary" />
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-left border-r pr-2">
                            <span className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Red (In)</span>
                            <span className="text-lg font-black text-primary">{result.sectionMain} mm²</span>
                          </div>
                          <div className="text-right pl-2">
                            <span className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Motor (6h)</span>
                            <span className="text-lg font-black text-accent">{result.sectionMotor} mm²</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-xl border text-[11px] text-left space-y-2">
                        <h4 className="font-bold text-primary uppercase text-[9px] tracking-widest">Aparamenta (IEC 60947)</h4>
                        <div className="flex justify-between font-medium">
                          <span className="text-muted-foreground">KM1 / KM2 (Linea/Δ):</span>
                          <span className="text-primary font-black">{result.contactorDelta?.toFixed(1)} A</span>
                        </div>
                        <div className="flex justify-between font-medium pt-1 border-t border-primary/10">
                          <span className="text-muted-foreground">KM3 (Estrella Y):</span>
                          <span className="text-primary font-black">{result.contactorStar?.toFixed(1)} A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4 relative z-10">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">VALOR RESULTANTE</p>
                    <div className="space-y-1">
                      <h3 className="text-6xl md:text-7xl font-black text-primary tabular-nums tracking-tighter">
                        {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '0'}
                      </h3>
                      <span className="text-2xl md:text-3xl font-black text-primary/60">
                        {activeTab === "potencia" ? "W" : activeTab === "corriente" ? "A" : activeTab === "seccion" ? "mm²" : "V"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        <Card className="p-5 bg-white/40 backdrop-blur-sm border-dashed rounded-2xl flex gap-4 hover:bg-white/60 transition-colors">
          <ArrowRightLeft className="h-8 w-8 text-primary shrink-0 p-1.5 bg-primary/10 rounded-xl" />
          <div className="text-sm space-y-1">
            <h5 className="font-bold text-primary">Ingeniería Electromecánica</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Cálculo de velocidades y relaciones de transmisión para optimizar el rendimiento del tren de potencia.</p>
          </div>
        </Card>
        <Card className="p-5 bg-white/40 backdrop-blur-sm border-dashed rounded-2xl flex gap-4 hover:bg-white/60 transition-colors">
          <ShieldCheck className="h-8 w-8 text-accent shrink-0 p-1.5 bg-accent/10 rounded-xl" />
          <div className="text-sm space-y-1">
            <h5 className="font-bold text-primary">Trazabilidad Normativa</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Todos los cálculos generan resultados auditables bajo estándares internacionales de ingeniería industrial.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
