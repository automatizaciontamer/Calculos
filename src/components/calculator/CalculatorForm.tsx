
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
import { Zap, Activity, Ruler, Info, Box, ShieldCheck, ThermometerSnowflake, Settings2, Plus, Trash2, ArrowRightLeft, MoveHorizontal, Cpu } from "lucide-react";

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
  const [includeNeutral, setIncludeNeutral] = useState(false);
  const [isSingleCore, setIsSingleCore] = useState(false);

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

  // Inputs Transmisión / Mecánica
  const [transSpeed, setTransSpeed] = useState("1450");
  const [transMode, setTransMode] = useState<'FORWARD' | 'REVERSE'>('FORWARD');
  const [transMotionType, setTransMotionType] = useState<'ROTARY' | 'LINEAR'>('ROTARY');
  const [linearLead, setLinearLead] = useState("5"); // mm/rev
  const [transStages, setTransStages] = useState<TransmissionStage[]>([{ input: 1, output: 1 }]);

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
        res = calculateCableSection(currentNum, lengthNum, maxVdNum, system, material, system === 'DC' ? 1 : pfNum, includeNeutral, isSingleCore);
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
        res = calculateTransmission(
          parseFloat(transSpeed), 
          transStages, 
          transMode, 
          transMotionType === 'LINEAR', 
          parseFloat(linearLead)
        );
        break;
    }
    setResult(res);
  };

  const getNormativeReference = () => {
    switch(activeTab) {
      case "seccion":
      case "caida":
        return "IEC 60364 / IRAM 2178";
      case "climatizacion":
        return "IEC 60890";
      case "estrella":
        return "IEC 60947-4-1";
      case "transmision":
        return transMotionType === 'LINEAR' ? "ISO 13012" : "ISO 6336";
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

                {activeTab === "seccion" && (
                  <div className="p-4 bg-primary/5 rounded-2xl space-y-4 border border-primary/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold">Tipo de Cableado</Label>
                        <p className="text-[10px] text-muted-foreground">Unifilar (Cables separados) vs Multipolar (Vainas)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{isSingleCore ? 'Unifilar' : 'Multipolar'}</span>
                        <Switch checked={isSingleCore} onCheckedChange={setIsSingleCore} />
                      </div>
                    </div>
                    {system === 'TRI' && (
                      <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-bold">Incluir Neutro</Label>
                          <p className="text-[10px] text-muted-foreground">Cálculo para 3P+N+PE vs 3P+PE</p>
                        </div>
                        <Switch checked={includeNeutral} onCheckedChange={setIncludeNeutral} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "transmision" ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Tipo de Movimiento</Label>
                        <Select value={transMotionType} onValueChange={(v) => setTransMotionType(v as any)}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ROTARY">Rotativo (RPM)</SelectItem>
                            <SelectItem value="LINEAR">Lineal (mm/s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Modo de Cálculo</Label>
                        <Select value={transMode} onValueChange={(v) => setTransMode(v as any)}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FORWARD">
                              {transMotionType === 'LINEAR' ? 'Calcular Desplazamiento' : 'Calcular Velocidad Final'}
                            </SelectItem>
                            <SelectItem value="REVERSE">
                              Calcular Velocidad Motor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">
                          {transMode === 'FORWARD' ? 'Velocidad Motor (RPM)' : (transMotionType === 'LINEAR' ? 'Velocidad Final (mm/s)' : 'Velocidad Final (RPM)')}
                        </Label>
                        <input type="number" value={transSpeed} onChange={(e) => setTransSpeed(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                      {transMotionType === 'LINEAR' && (
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">Paso / Avance (mm/rev)</Label>
                          <input type="number" value={linearLead} onChange={(e) => setLinearLead(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Ejem: 5mm (husillo)" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-primary font-bold">Relación de Transmisión (Reductora)</Label>
                        <Button variant="outline" size="sm" onClick={handleAddStage} className="h-8 gap-1.5 rounded-full text-xs">
                          <Plus className="h-3 w-3" /> Nueva Etapa
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {transStages.map((stage, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-end gap-3 p-4 bg-muted/20 rounded-2xl border border-primary/5">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Entrada (Z1 / D1)</Label>
                              <input 
                                type="number" 
                                value={stage.input} 
                                onChange={(e) => handleUpdateStage(idx, 'input', e.target.value)} 
                                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Salida (Z2 / D2)</Label>
                              <input 
                                type="number" 
                                value={stage.output} 
                                onChange={(e) => handleUpdateStage(idx, 'output', e.target.value)} 
                                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <input type="number" value={vfdCount} onChange={(e) => setVfdCount(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia VFD (kW)</Label>
                      <input type="number" value={vfdPowerKw} onChange={(e) => setVfdPowerKw(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Ancho (mm)</Label>
                      <input type="number" value={panelW} onChange={(e) => setPanelW(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Alto (mm)</Label>
                      <input type="number" value={panelH} onChange={(e) => setPanelH(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Int Deseada (°C)</Label>
                      <input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Ext Máx (°C)</Label>
                      <input type="number" value={tExt} onChange={(e) => setTExt(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                  </div>
                ) : activeTab === "estrella" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia Motor (W)</Label>
                      <input type="number" value={p} onChange={(e) => setP(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tensión (V)</Label>
                      <input type="number" value={v} onChange={(e) => setV(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">cos φ (Placa)</Label>
                      <input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Rendimiento η (%)</Label>
                      <input type="number" value={eff} onChange={(e) => setEff(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tensión (V)</Label>
                      <input type="number" value={v} onChange={(e) => setV(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Corriente (A)</Label>
                      <input type="number" value={i} onChange={(e) => setI(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    {activeTab === "corriente" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia (W)</Label>
                        <input type="number" value={p} onChange={(e) => setP(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                      </div>
                    )}
                    {system !== "DC" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Factor de Potencia</Label>
                        <input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                      </div>
                    )}
                    {(activeTab === "seccion" || activeTab === "caida") && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">Longitud (m)</Label>
                          <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
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
                            <input type="number" value={section} onChange={(e) => setSection(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">ΔV Admisible (V)</Label>
                            <input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
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
                ) : activeTab === "seccion" && typeof result === 'object' && 'commercial' in result ? (
                  <div className="w-full space-y-6 relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">SECCIÓN COMERCIAL RECOMENDADA</p>
                      <h3 className="text-6xl md:text-7xl font-black text-primary tabular-nums tracking-tighter">
                        {result.commercial}
                        <span className="text-2xl ml-2 text-primary/60">mm²</span>
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 font-bold">Cálculo teórico: {result.section?.toFixed(2)} mm²</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border-2 border-accent/20 shadow-lg scale-105">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">FORMACIÓN DEL CONDUCTOR</p>
                      <div className="space-y-2">
                        <span className="text-3xl font-black text-accent block">
                          {result.formation}
                        </span>
                        <div className="flex justify-center gap-2">
                           <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded uppercase">
                             {result.descriptiveLabel}
                           </span>
                           <span className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-black rounded uppercase">
                             {result.isSingleCore ? 'UNIFILAR' : 'MULTIPOLAR'}
                           </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-4 text-left">
                      <div className="bg-primary/5 p-3 rounded-xl border border-dashed text-[10px] leading-tight">
                        <p className="font-bold text-primary mb-1">NOTAS TÉCNICAS:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Verificado por Ampacidad (IEC 60364-5-52).</li>
                          <li>• Verificado por Caída de Tensión.</li>
                          <li>• Formación sugerida para cable tipo subterráneo / industrial.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "transmision" && typeof result === 'object' && 'resultValue' in result ? (
                  <div className="w-full space-y-6 relative z-10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Settings2 className="h-4 w-4" /> 
                      {transMode === 'FORWARD' 
                        ? (result.isLinear ? 'VELOCIDAD LINEAL CALCULADA' : 'VELOCIDAD FINAL CALCULADA')
                        : 'VELOCIDAD REQUERIDA MOTOR'}
                    </p>
                    <div className="space-y-1">
                      <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums">
                        {result.resultValue?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </h3>
                      <span className="text-xl md:text-2xl font-bold text-primary/60">
                        {transMode === 'FORWARD' && result.isLinear ? 'mm/s' : 'RPM'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-8">
                      <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Relación de Transmisión (I)</span>
                        <span className="text-3xl font-black text-accent">1 : {result.totalRatio?.toFixed(2)}</span>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">Factor de desmultiplicación mecánica</p>
                      </div>
                      {result.isLinear && (
                        <div className="bg-primary/5 p-3 rounded-xl border border-dashed text-[11px] flex justify-between items-center px-4">
                          <span className="text-muted-foreground font-medium">Paso configurado:</span>
                          <span className="font-bold text-primary">{linearLead} mm/rev</span>
                        </div>
                      )}
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
                  <div className="w-full space-y-4 relative z-10 text-left overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    <div className="bg-white p-4 rounded-2xl border-2 border-accent/20 shadow-md">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Ajuste Relé Térmico (Ir)</p>
                      <h3 className="text-4xl font-black text-accent tabular-nums flex items-baseline gap-2">
                        {result.relaySetting?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-lg font-bold">A</span>
                      </h3>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase mt-1 tracking-tight">PROTECCIÓN BASADA EN CORRIENTE DE FASE (In/√3)</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase border-b pb-2 flex items-center justify-between tracking-wider">
                          <span>Contactores (IEC 60947-4-1)</span>
                          <Cpu className="h-4 w-4 text-primary" />
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-primary/5 rounded-lg border text-center">
                            <span className="block text-[8px] font-bold text-muted-foreground">KM1 (LÍNEA)</span>
                            <span className="text-sm font-black text-primary">{result.contactorMain?.toFixed(1)}A</span>
                          </div>
                          <div className="p-2 bg-primary/5 rounded-lg border text-center">
                            <span className="block text-[8px] font-bold text-muted-foreground">KM2 (Δ)</span>
                            <span className="text-sm font-black text-primary">{result.contactorDelta?.toFixed(1)}A</span>
                          </div>
                          <div className="p-2 bg-primary/5 rounded-lg border text-center">
                            <span className="block text-[8px] font-bold text-muted-foreground">KM3 (Y)</span>
                            <span className="text-sm font-black text-accent">{result.contactorStar?.toFixed(1)}A</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase border-b pb-2 flex items-center justify-between tracking-wider">
                          <span>Conductores (IEC 60364)</span>
                          <Ruler className="h-4 w-4 text-primary" />
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                            <div className="text-left">
                              <span className="block text-[9px] font-bold text-muted-foreground">LÍNEA ALIMENTACIÓN (3P+PE)</span>
                              <span className="text-sm font-black text-primary">Sección: {result.sectionMain} mm²</span>
                            </div>
                            <Box className="h-5 w-5 text-primary/30" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-accent/5 rounded-lg border-accent/20 border">
                            <div className="text-left">
                              <span className="block text-[9px] font-bold text-muted-foreground">CONEXIÓN MOTOR (6 HILOS)</span>
                              <span className="text-sm font-black text-accent">Sección: {result.sectionMotor} mm²</span>
                            </div>
                            <ArrowRightLeft className="h-5 w-5 text-accent/30" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 rounded-xl border border-dashed text-[10px] leading-tight text-muted-foreground">
                      <p className="font-bold text-primary mb-1">CÁLCULO DE CORRIENTES:</p>
                      <ul className="space-y-1">
                        <li>• In: {result.nominalCurrent?.toFixed(2)}A</li>
                        <li>• Corriente de Fase (Ir): {result.relaySetting?.toFixed(2)}A</li>
                        <li>• Reducción en Estrella (In/3): {result.contactorStar?.toFixed(2)}A</li>
                      </ul>
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
          <MoveHorizontal className="h-8 w-8 text-primary shrink-0 p-1.5 bg-primary/10 rounded-xl" />
          <div className="text-sm space-y-1">
            <h5 className="font-bold text-primary">Cinemática Lineal</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Dimensionamiento de husillos y correas dentadas para servomotores con alta precisión milimétrica.</p>
          </div>
        </Card>
        <Card className="p-5 bg-white/40 backdrop-blur-sm border-dashed rounded-2xl flex gap-4 hover:bg-white/60 transition-colors">
          <ShieldCheck className="h-8 w-8 text-accent shrink-0 p-1.5 bg-accent/10 rounded-xl" />
          <div className="text-sm space-y-1">
            <h5 className="font-bold text-primary">Trazabilidad Normativa</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Cálculos auditables bajo estándares ISO 13012 para componentes de movimiento lineal industrial.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
