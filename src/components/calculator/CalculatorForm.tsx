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
import { Zap, Activity, Ruler, Info, Box, ShieldCheck, ThermometerSnowflake } from "lucide-react";

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
        return "IEC 60947-4-1 / 60228";
      default:
        return "IEC 60038 / 60364";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg border-none bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="text-center pb-2 bg-primary/5 border-b mb-6 relative">
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> {getNormativeReference()}
          </div>
          <CardTitle className="text-3xl font-black text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-accent fill-accent" />
            Ingeniería Eléctrica IEC
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            Cálculos industriales normalizados bajo estándares internacionales
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
              <TabsTrigger value="estrella" className="py-2.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Arrancadores</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Side */}
              <div className="space-y-4">
                {activeTab !== "climatizacion" && activeTab !== "estrella" && (
                  <div className="space-y-2">
                    <Label>Sistema Eléctrico (IEC 60038)</Label>
                    <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DC">DC (Continuo)</SelectItem>
                        <SelectItem value="MONO">230V Monofásico</SelectItem>
                        <SelectItem value="BI">400V Bifásico</SelectItem>
                        <SelectItem value="TRI">400V Trifásico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeTab === "climatizacion" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Material (IEC 60890 - k disipación)</Label>
                      <Select value={panelMaterial} onValueChange={(v) => setPanelMaterial(v as keyof typeof MATERIAL_K)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHAPA_PINTADA">Chapa de Acero (k=5.5)</SelectItem>
                          <SelectItem value="ACERO_INOX">Acero Inoxidable (k=3.7)</SelectItem>
                          <SelectItem value="ALUMINIO">Aluminio (k=12.0)</SelectItem>
                          <SelectItem value="PLASTICO">Plástico/Poliéster (k=3.5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Tipo de Instalación (Superficie efectiva)</Label>
                      <Select value={installation} onValueChange={(v) => setInstallation(v as InstallationType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">Exento (6 caras libres)</SelectItem>
                          <SelectItem value="WALL">Contra pared (5 caras libres)</SelectItem>
                          <SelectItem value="ROW">En fila (4 caras libres)</SelectItem>
                          <SelectItem value="RECESSED">Empotrado (1 cara libre)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cant. VFDs</Label>
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
                      <Label>Otras Cargas (W)</Label>
                      <Input type="number" value={otherPowerLoss} onChange={(e) => setOtherPowerLoss(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Profundo (mm)</Label>
                      <Input type="number" value={panelD} onChange={(e) => setPanelD(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>T. Int Deseada (°C)</Label>
                      <Input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>T. Ext Máx (°C)</Label>
                      <Input type="number" value={tExt} onChange={(e) => setTExt(e.target.value)} />
                    </div>
                  </div>
                ) : activeTab === "estrella" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Potencia (W)</Label>
                      <Input type="number" value={p} onChange={(e) => setP(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tensión (V)</Label>
                      <Input type="number" value={v} onChange={(e) => setV(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>cos φ (Nominal)</Label>
                      <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rendimiento η (%)</Label>
                      <Input type="number" value={eff} onChange={(e) => setEff(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tensión (V)</Label>
                      <Input type="number" value={v} onChange={(e) => setV(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Corriente (A)</Label>
                      <Input type="number" value={i} onChange={(e) => setI(e.target.value)} />
                    </div>
                    {activeTab === "corriente" && (
                      <div className="space-y-2">
                        <Label>Potencia (W)</Label>
                        <Input type="number" value={p} onChange={(e) => setP(e.target.value)} />
                      </div>
                    )}
                    {system !== "DC" && (
                      <div className="space-y-2">
                        <Label>Factor de Potencia</Label>
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
                          <Label>Conductor (IEC 60228)</Label>
                          <Select value={material} onValueChange={(v) => setMaterial(v as keyof typeof CONDUCTIVITY)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COBRE">Cobre electrolítico</SelectItem>
                              <SelectItem value="ALUMINIO">Aluminio industrial</SelectItem>
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
                            <Label>ΔV Admisible (V)</Label>
                            <Input type="number" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <Button onClick={handleCalculate} className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-lg">
                  CALCULAR BAJO IEC
                </Button>
              </div>

              {/* Results Side */}
              <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/10 flex flex-col items-center justify-center text-center">
                {result === null ? (
                  <div className="text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Seleccione una pestaña y complete los datos para aplicar las normas IEC correspondientes.</p>
                  </div>
                ) : activeTab === "climatizacion" && typeof result === 'object' && 'coolingPower' in result ? (
                  <div className="w-full space-y-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1">
                      <ThermometerSnowflake className="h-3 w-3" /> Potencia Frigorífica Necesaria
                    </p>
                    <h3 className="text-5xl font-black text-primary">
                      {result.coolingPower?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      <span className="text-2xl ml-2">W</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-[10px] text-left">
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Pv Variadores:</span>
                        <span className="font-bold">{result.vfdLosses?.toFixed(1)} W</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Pérdidas Totales:</span>
                        <span className="font-bold">{result.totalPowerLoss?.toFixed(1)} W</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">Superficie A (IEC 60890):</span>
                        <span className="font-bold">{result.surfaceArea?.toFixed(2)} m²</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="block text-muted-foreground">ΔT Térmico:</span>
                        <span className="font-bold">{result.deltaT} °C</span>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "estrella" && typeof result === 'object' && 'relaySetting' in result ? (
                  <div className="w-full space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Corriente Nominal del Motor</p>
                      <h3 className="text-4xl font-black text-primary">
                        {result.nominalCurrent?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-xl ml-2">A</span>
                      </h3>
                    </div>
                    
                    <div className="p-4 bg-white rounded-xl border-2 border-primary/20 shadow-sm">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Ajuste de Protección Térmica</p>
                      <h3 className="text-5xl font-black text-primary">
                        {result.relaySetting?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-2xl ml-2">A</span>
                      </h3>
                      <p className="text-[9px] text-muted-foreground mt-1 font-medium">Dimensionado para corriente de fase (In / 1.73)</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase border-b pb-2 flex items-center justify-between">
                          <span>Conductores (IEC 60364-5-52)</span>
                          <Ruler className="h-3 w-3" />
                        </h4>
                        <div className="flex justify-between items-center">
                          <div className="text-left">
                            <span className="block text-[9px] text-muted-foreground uppercase">Alimentación In</span>
                            <span className="text-lg font-black text-primary">{result.sectionMain} mm²</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] text-muted-foreground uppercase">Hacia Motor (6 hilos)</span>
                            <span className="text-lg font-black text-accent">{result.sectionMotor} mm²</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2 text-[10px]">
                        <h4 className="font-bold text-muted-foreground border-b pb-1 uppercase">Switchgear (IEC 60947-4-1)</h4>
                        <div className="flex justify-between">
                          <span>KM1 / KM2 (Linea/Delta):</span>
                          <span className="font-bold">{result.contactorDelta?.toFixed(1)} A</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span>KM3 (Estrella):</span>
                          <span className="font-bold">{result.contactorStar?.toFixed(1)} A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Valor Resultante</p>
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
            <h5 className="font-bold">Normalización IEC</h5>
            <p className="text-muted-foreground">Los calibres de cables se obtienen de la tabla de ampacidad <strong>IEC 60364-5-52</strong> para Método C, garantizando seguridad térmica bajo carga continua.</p>
          </div>
        </Card>
        <Card className="p-4 bg-muted/30 border-dashed flex gap-3">
          <ShieldCheck className="h-6 w-6 text-accent shrink-0" />
          <div className="text-sm">
            <h5 className="font-bold">Cumplimiento Industrial</h5>
            <p className="text-muted-foreground">Dimensionamiento de aparellaje motor según <strong>IEC 60947</strong> para categorías de empleo AC-3. Secciones transversales normalizadas por <strong>IEC 60228</strong>.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
