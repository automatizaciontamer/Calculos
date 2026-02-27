"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  SystemType, 
  InstallationType,
  MATERIAL_K,
  RESISTOR_COLORS,
  calculatePower, 
  calculateCurrent, 
  calculateVoltageDrop, 
  calculateCableSection, 
  calculatePanelCooling,
  calculateStarDelta,
  calculateMotorProtection,
  calculateTransmission,
  calculateResistor,
  TransmissionStage,
  CONDUCTIVITY,
  COMMERCIAL_SECTIONS
} from "@/lib/electrical-formulas";
import { 
  Zap, 
  Activity, 
  Ruler, 
  Info, 
  Box, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Settings2, 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  MoveHorizontal, 
  Cpu, 
  Palette, 
  ShieldAlert, 
  Wind, 
  Calculator,
  BookOpen,
  FileText,
  Layers,
  CheckCircle2,
  HardHat
} from "lucide-react";

export default function CalculatorForm() {
  const [activeTab, setActiveTab] = useState("potencia");
  const [system, setSystem] = useState<SystemType>("MONO");
  const [material, setMaterial] = useState<keyof typeof CONDUCTIVITY>("COBRE");
  
  // Inputs Generales
  const [v, setV] = useState("380");
  const [i, setI] = useState("10");
  const [p, setP] = useState("7500");
  const [pf, setPf] = useState("0.85");
  const [eff, setEff] = useState("70"); 
  const [length, setLength] = useState("50");
  const [section, setSection] = useState("2.5");
  const [maxVdPercent, setMaxVdPercent] = useState("3"); 
  const [includeNeutral, setIncludeNeutral] = useState(false);
  const [isSingleCore, setIsSingleCore] = useState(false);

  // Inputs Climatización
  const [coolingMode, setCoolingMode] = useState<'AC' | 'VENT'>('AC');
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

  // Inputs Protección Motor
  const [motorProtectionType, setMotorProtectionType] = useState<'GUARDAMOTOR' | 'TERMOMAGNETICA'>('GUARDAMOTOR');

  // Inputs Transmisión / Mecánica
  const [transSpeed, setTransSpeed] = useState("1450");
  const [transMode, setTransMode] = useState<'FORWARD' | 'REVERSE'>('FORWARD');
  const [transMotionType, setTransMotionType] = useState<'ROTARY' | 'LINEAR'>('ROTARY');
  const [linearLead, setLinearLead] = useState("5"); 
  const [transStages, setTransStages] = useState<TransmissionStage[]>([{ input: 1, output: 1 }]);

  // Inputs Resistencia
  const [resistorBandCount, setResistorBandCount] = useState<4 | 5>(4);
  const [resistorBands, setResistorBands] = useState<string[]>(['brown', 'black', 'red', 'gold']);

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
    const maxVdPercentNum = parseFloat(maxVdPercent) || 3;

    let res: any = null;
    switch (activeTab) {
      case "potencia":
        res = calculatePower(voltageNum, currentNum, system, system === 'DC' ? 1 : pfNum);
        break;
      case "corriente":
        res = calculateCurrent(powerNum, voltageNum, system, system === 'DC' ? 1 : pfNum);
        break;
      case "seccion":
        const maxVdVolts = (maxVdPercentNum / 100) * voltageNum;
        res = calculateCableSection(currentNum, lengthNum, maxVdVolts, system, material, system === 'DC' ? 1 : pfNum, includeNeutral, isSingleCore);
        res = { 
          ...res, 
          maxVdVolts,
          params: { L: lengthNum, I: currentNum, Vd: maxVdVolts, k: CONDUCTIVITY[material], pf: system === 'DC' ? 1 : pfNum, system, V: voltageNum }
        };
        break;
      case "caida":
        res = calculateVoltageDrop(currentNum, lengthNum, sectionNum, system, material, system === 'DC' ? 1 : pfNum);
        break;
      case "climatizacion":
        res = calculatePanelCooling(
          parseFloat(panelW), parseFloat(panelH), parseFloat(panelD),
          parseFloat(otherPowerLoss), parseFloat(vfdCount), parseFloat(vfdPowerKw),
          parseFloat(tInt), parseFloat(tExt), panelMaterial, installation, coolingMode
        );
        break;
      case "estrella":
        res = calculateStarDelta(powerNum, voltageNum, pfNum, effNum);
        break;
      case "proteccion":
        res = calculateMotorProtection(powerNum, voltageNum, pfNum, effNum, motorProtectionType, system);
        break;
      case "transmision":
        res = calculateTransmission(
          parseFloat(transSpeed), transStages, transMode, transMotionType === 'LINEAR', parseFloat(linearLead)
        );
        break;
      case "resistencia":
        res = calculateResistor(resistorBands);
        break;
    }
    setResult(res);
  };

  const getNormativeReference = () => {
    switch(activeTab) {
      case "seccion":
      case "caida": return "IEC 60364 / IRAM 2178";
      case "climatizacion": return "IEC 60890";
      case "estrella":
      case "proteccion": return "IEC 60947-4-1 / 60364";
      case "transmision": return transMotionType === 'LINEAR' ? "ISO 13012" : "ISO 6336";
      case "resistencia": return "IEC 60062";
      default: return "IEC 60038 / 60364";
    }
  };

  const handleResistorBandChange = (index: number, color: string) => {
    const newBands = [...resistorBands];
    newBands[index] = color;
    setResistorBands(newBands);
  };

  useEffect(() => {
    if (activeTab === "resistencia") {
      const default4 = ['brown', 'black', 'red', 'gold'];
      const default5 = ['brown', 'black', 'black', 'brown', 'gold'];
      setResistorBands(resistorBandCount === 4 ? default4 : default5);
    }
  }, [resistorBandCount, activeTab]);

  const formatNum = (num: number | undefined | null, decimals: number = 2) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-2xl border-none bg-card/80 backdrop-blur-md overflow-hidden rounded-3xl">
        <CardHeader className="text-center pb-6 bg-primary/5 border-b mb-6 relative px-4 md:px-8">
          {/* Botón de Manual Técnico - Ahora visible en todos los dispositivos */}
          <div className="flex flex-col sm:flex-row absolute top-3 right-3 sm:top-4 sm:right-4 items-end sm:items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white border-primary/20 text-primary hover:bg-primary/5 rounded-full font-bold gap-2 text-[10px] md:text-xs shadow-sm">
                  <BookOpen className="h-3.5 w-3.5" /> MANUAL TÉCNICO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none rounded-3xl">
                <div className="bg-primary text-white p-6 md:p-8">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <DialogTitle className="text-2xl font-black text-white">Manual Técnico de Ingeniería</DialogTitle>
                    </div>
                    <DialogDescription className="text-primary-foreground/80 text-sm">
                      Especificaciones normalizadas para el diseño, fabricación y montaje de tableros eléctricos industriales.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <ScrollArea className="h-[60vh] md:h-[70vh] p-6 md:p-10">
                  <div className="space-y-12">
                    {/* Sección 1: Diseño y Fabricación */}
                    <section className="space-y-6">
                      <h3 className="text-xl font-black text-primary flex items-center gap-2 border-b pb-2">
                        <Layers className="h-5 w-5 text-accent" /> 1. Diseño y Fabricación (IEC 61439)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Grados de Protección</h4>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                              <span><strong>IP 54 / 65:</strong> Estanqueidad contra polvo y agua según entorno.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                              <span><strong>IK 10:</strong> Resistencia a impactos mecánicos externos.</span>
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Segregación Interna</h4>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                              <span><strong>Forma 1:</strong> Sin segregación interna.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                              <span><strong>Forma 2-4:</strong> Separación de barras, unidades funcionales y bornes.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Sección 2: Código de Colores */}
                    <section className="space-y-6">
                      <h3 className="text-xl font-black text-primary flex items-center gap-2 border-b pb-2">
                        <Palette className="h-5 w-5 text-accent" /> 2. Código de Colores (IEC 60445)
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-bold">Función del Conductor</TableHead>
                            <TableHead className="font-bold">Color Normalizado</TableHead>
                            <TableHead className="font-bold">Aplicación</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Fases (L1, L2, L3)</TableCell>
                            <TableCell>Marrón / Negro / Gris</TableCell>
                            <TableCell>Potencia AC Trifásica</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Neutro (N)</TableCell>
                            <TableCell className="text-blue-600 font-bold">Azul Claro</TableCell>
                            <TableCell>Retorno AC</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Protección (PE)</TableCell>
                            <TableCell className="text-green-600 font-bold">Verde / Amarillo</TableCell>
                            <TableCell>Puesta a tierra</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Control AC (Mando)</TableCell>
                            <TableCell className="text-red-600 font-bold">Rojo</TableCell>
                            <TableCell>Circuitos de maniobra AC</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Control DC (24V)</TableCell>
                            <TableCell className="text-blue-800 font-bold">Azul Oscuro</TableCell>
                            <TableCell>Automatización / PLC</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </section>

                    {/* Sección 3: Dimensionamiento de Cables */}
                    <section className="space-y-6">
                      <h3 className="text-xl font-black text-primary flex items-center gap-2 border-b pb-2">
                        <Ruler className="h-5 w-5 text-accent" /> 3. Secciones y Ampacidad (IEC 60364)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Referencia rápida para conductores de Cobre (PVC 70°C) en canalización cerrada.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { s: "1,5", i: "14,5" },
                          { s: "2,5", i: "19,5" },
                          { s: "4", i: "26" },
                          { s: "6", i: "34" },
                          { s: "10", i: "46" },
                          { s: "16", i: "61" },
                          { s: "25", i: "80" },
                          { s: "35", i: "99" }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-white border rounded-2xl shadow-sm flex flex-col items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Sección</span>
                            <span className="text-lg font-black text-primary">{item.s} mm²</span>
                            <div className="w-full h-px bg-muted my-1" />
                            <span className="text-xs font-bold text-accent">{item.i} A máx.</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Sección 4: Tensiones Normalizadas */}
                    <section className="space-y-6 pb-6">
                      <h3 className="text-xl font-black text-primary flex items-center gap-2 border-b pb-2">
                        <Zap className="h-5 w-5 text-accent" /> 4. Tensiones Estándar (IEC 60038)
                      </h3>
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span><strong>Baja Tensión AC:</strong> 230V / 400V (50/60 Hz)</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span><strong>Control Industrial:</strong> 24V DC / 110V AC</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span><strong>Tolerancia admitida:</strong> ± 10% (IEC 60038)</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span><strong>Seguridad (SELV):</strong> &lt; 50V AC / 120V DC</span>
                          </li>
                        </ul>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
                <div className="bg-muted/30 p-4 border-t text-center">
                  <p className="text-[10px] font-bold text-muted-foreground">TAMER INDUSTRIAL S.A. | SOFTWARE DE ASISTENCIA TÉCNICA NORMALIZADA</p>
                </div>
              </DialogContent>
            </Dialog>
            <div className="px-3 md:px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
              <ShieldCheck className="h-3 w-3 text-accent" /> {getNormativeReference()}
            </div>
          </div>

          <CardTitle className="text-2xl md:text-3xl font-black text-primary flex flex-col md:flex-row items-center justify-center gap-2 mt-12 sm:mt-0">
            <Zap className="h-8 w-8 text-accent fill-accent" />
            Ingeniería Industrial IEC
          </CardTitle>
          <CardDescription className="text-sm md:text-base font-medium">
            Dimensionamiento profesional de sistemas eléctricos y transmisiones mecánicas
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-9 h-auto p-1.5 bg-muted/50 gap-1.5 rounded-2xl mb-8 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="potencia" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Potencia</TabsTrigger>
              <TabsTrigger value="corriente" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Corriente</TabsTrigger>
              <TabsTrigger value="seccion" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Sección</TabsTrigger>
              <TabsTrigger value="caida" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Caída</TabsTrigger>
              <TabsTrigger value="climatizacion" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Clima</TabsTrigger>
              <TabsTrigger value="estrella" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Y-Δ</TabsTrigger>
              <TabsTrigger value="proteccion" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Protección</TabsTrigger>
              <TabsTrigger value="transmision" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Mecánica</TabsTrigger>
              <TabsTrigger value="resistencia" className="py-2.5 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Color Ω</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {(activeTab !== "climatizacion" && activeTab !== "estrella" && activeTab !== "transmision" && activeTab !== "resistencia" && activeTab !== "proteccion") && (
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

                {activeTab === "resistencia" ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tipo de Resistencia</Label>
                      <Select value={resistorBandCount.toString()} onValueChange={(v) => setResistorBandCount(parseInt(v) as 4 | 5)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 Bandas (Estándar)</SelectItem>
                          <SelectItem value="5">5 Bandas (Precisión)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      {resistorBands.map((band, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                            {idx === resistorBands.length - 1 ? 'Tolerancia' : idx === resistorBands.length - 2 ? 'Multiplicador' : `Banda ${idx + 1}`}
                          </Label>
                          <Select value={band} onValueChange={(v) => handleResistorBandChange(idx, v)}>
                            <SelectTrigger className="h-10 rounded-xl">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: RESISTOR_COLORS.find(c => c.color === band)?.hex }} />
                                <span>{RESISTOR_COLORS.find(c => c.color === band)?.label}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {RESISTOR_COLORS.filter(c => {
                                if (idx === resistorBands.length - 1) return c.tolerance !== null;
                                if (idx === resistorBands.length - 2) return c.multiplier !== null;
                                return c.value !== null;
                              }).map(color => (
                                <SelectItem key={color.color} value={color.color}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }} />
                                    <span>{color.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeTab === "transmision" ? (
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
                        <Input type="number" value={transSpeed} onChange={(e) => setTransSpeed(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                      {transMotionType === 'LINEAR' && (
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">Paso / Avance (mm/rev)</Label>
                          <Input type="number" value={linearLead} onChange={(e) => setLinearLead(e.target.value)} className="h-11 rounded-xl" placeholder="Ejem: 5mm (husillo)" />
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
                              <Input type="number" value={stage.input} onChange={(e) => handleUpdateStage(idx, 'input', e.target.value)} className="h-10 rounded-lg" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Salida (Z2 / D2)</Label>
                              <Input type="number" value={stage.output} onChange={(e) => handleUpdateStage(idx, 'output', e.target.value)} className="h-10 rounded-lg" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveStage(idx)} className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg" disabled={transStages.length === 1}>
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
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Tipo de Climatización</Label>
                      <Select value={coolingMode} onValueChange={(v) => setCoolingMode(v as 'AC' | 'VENT')}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">Aire Acondicionado (Control Térmico)</SelectItem>
                          <SelectItem value="VENT">Ventilación Forzada (Extracción)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Int Máx (°C)</Label>
                      <Input type="number" value={tInt} onChange={(e) => setTInt(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">T. Ext Máx (°C)</Label>
                      <Input type="number" value={tExt} onChange={(e) => setTExt(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                  </div>
                ) : (activeTab === "estrella" || activeTab === "proteccion") ? (
                  <div className="space-y-6">
                    {activeTab === "proteccion" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Tipo de Protección</Label>
                        <Select value={motorProtectionType} onValueChange={(v) => setMotorProtectionType(v as any)}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GUARDAMOTOR">Guardamotor (Ajustable)</SelectItem>
                            <SelectItem value="TERMOMAGNETICA">Termomagnética (Calibre Fijo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Sistema Eléctrico</Label>
                        <Select value={system} onValueChange={(v) => setSystem(v as SystemType)}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONO">230V Monofásico</SelectItem>
                            <SelectItem value="TRI">400V Trifásico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Potencia Motor (W)</Label>
                        <Input type="number" value={p} onChange={(e) => setP(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Tensión (V)</Label>
                        <Input type="number" value={v} onChange={(e) => setV(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">cos φ (Placa)</Label>
                        <Input type="number" step="0.01" value={pf} onChange={(e) => setPf(e.target.value)} className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Rendimiento η (%)</Label>
                        <Input type="number" value={eff} onChange={(e) => setEff(e.target.value)} className="h-11 rounded-xl" />
                      </div>
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
                            <Label className="text-xs uppercase font-bold text-muted-foreground">Caída de Tensión Máx. (%)</Label>
                            <Input 
                              type="number" 
                              value={maxVdPercent} 
                              onChange={(e) => setMaxVdPercent(e.target.value)} 
                              className="h-11 rounded-xl" 
                              placeholder="Ejem: 3% Alumbrado / 5% Fuerza"
                            />
                            <p className="text-[10px] text-muted-foreground italic">Referencia IEC 60364: 3% Alumbrado / 5% Fuerza</p>
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

              <div className="lg:col-span-2 bg-primary/[0.03] rounded-3xl p-6 md:p-8 border-2 border-primary/10 flex flex-col items-center justify-start text-center relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                {result === null ? (
                  <div className="text-muted-foreground relative z-10 py-12 flex flex-col items-center justify-center h-full">
                    <Info className="h-16 w-16 mx-auto mb-6 text-primary/20" />
                    <p className="text-sm font-medium px-4">Complete los parámetros técnicos para generar el informe basado en normativa IEC.</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-grow">
                      {activeTab === "resistencia" && typeof result === 'object' && 'value' in result ? (
                        <div className="w-full space-y-6 relative z-10">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <Palette className="h-4 w-4" /> VALOR DE RESISTENCIA
                          </p>
                          <div className="space-y-1">
                            <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums tracking-tighter">
                              {result.value >= 1000000 
                                ? formatNum(result.value / 1000000, 2) + ' M'
                                : result.value >= 1000 
                                ? formatNum(result.value / 1000, 2) + ' k'
                                : formatNum(result.value, 0)}
                              <span className="text-2xl ml-1">Ω</span>
                            </h3>
                            <p className="text-sm font-bold text-accent">±{formatNum(result.tolerance, 1)}% Tolerancia</p>
                          </div>
                          <div className="relative h-16 w-full flex items-center justify-center bg-muted/20 rounded-2xl border-2 border-dashed border-primary/20 p-2">
                             <div className="h-6 w-full max-w-[200px] bg-slate-300 rounded-full flex items-center px-4 gap-2">
                                {resistorBands.map((band, i) => (
                                  <div key={i} className="h-full w-2 shadow-sm" style={{ backgroundColor: RESISTOR_COLORS.find(c => c.color === band)?.hex }} />
                                ))}
                             </div>
                          </div>
                        </div>
                      ) : activeTab === "seccion" && typeof result === 'object' && 'commercial' in result ? (
                        <div className="w-full space-y-4 relative z-10">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">SECCIÓN COMERCIAL RECOMENDADA</p>
                          <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums tracking-tighter">
                            {formatNum(result.commercial, 1)}
                            <span className="text-2xl ml-2 text-primary/60">mm²</span>
                          </h3>
                          <div className="bg-white p-4 rounded-2xl border-2 border-accent/20 shadow-lg">
                            <span className="text-2xl font-black text-accent block">{result.formation}</span>
                            <div className="flex justify-center gap-2 mt-2">
                               <span className="px-2 py-1 bg-accent/10 text-accent text-[8px] font-black rounded uppercase">{result.descriptiveLabel}</span>
                               <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black rounded uppercase">{result.isSingleCore ? 'UNIFILAR' : 'MULTIPOLAR'}</span>
                            </div>
                          </div>
                        </div>
                      ) : activeTab === "transmision" && typeof result === 'object' && 'resultValue' in result ? (
                        <div className="w-full space-y-6 relative z-10">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <Settings2 className="h-4 w-4" /> 
                            {transMode === 'FORWARD' ? (result.isLinear ? 'VELOCIDAD LINEAL' : 'VELOCIDAD FINAL') : 'RPM MOTOR REQUERIDA'}
                          </p>
                          <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums">
                            {formatNum(result.resultValue, 1)}
                            <span className="text-xl ml-2 text-primary/60">{transMode === 'FORWARD' && result.isLinear ? 'mm/s' : 'RPM'}</span>
                          </h3>
                          <div className="bg-white p-5 rounded-2xl border shadow-sm">
                            <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-2 tracking-widest">Relación Total (i)</span>
                            <span className="text-3xl font-black text-accent">1 : {formatNum(result.totalRatio, 2)}</span>
                          </div>
                        </div>
                      ) : activeTab === "climatizacion" && typeof result === 'object' && ('coolingPower' in result || 'airflow' in result) ? (
                        <div className="w-full space-y-6 relative z-10">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                            {result.mode === 'AC' ? <ThermometerSnowflake className="h-4 w-4" /> : <Wind className="h-4 w-4" />}
                            {result.mode === 'AC' ? 'POTENCIA FRIGORÍFICA' : 'CAUDAL VENTILACIÓN'}
                          </p>
                          <h3 className="text-5xl md:text-6xl font-black text-primary tabular-nums">
                            {result.mode === 'AC' ? formatNum(result.coolingPower, 0) : formatNum(result.airflow, 1)}
                            <span className="text-xl ml-2 text-primary/60">{result.mode === 'AC' ? 'W' : 'm³/h'}</span>
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="bg-white p-3 rounded-xl border shadow-sm col-span-2">
                              <span className="block text-[9px] font-bold text-muted-foreground uppercase">Pérdidas Totales (Pv)</span>
                              <span className="text-lg font-black text-primary">{formatNum(result.totalPowerLoss, 1)} W</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border shadow-sm">
                              <span className="block text-[9px] font-bold text-muted-foreground uppercase">Superficie (A)</span>
                              <span className="text-sm font-bold text-accent">{formatNum(result.surfaceArea, 2)} m²</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border shadow-sm">
                              <span className="block text-[9px] font-bold text-muted-foreground uppercase">ΔT</span>
                              <span className="text-sm font-bold text-accent">{formatNum(result.deltaT, 1)} °C</span>
                            </div>
                          </div>
                        </div>
                      ) : activeTab === "estrella" && typeof result === 'object' && 'relaySetting' in result ? (
                        <div className="w-full space-y-4 relative z-10 text-left">
                          <div className="bg-white p-4 rounded-2xl border-2 border-accent/20 shadow-md">
                            <p className="text-[10px] font-bold text-primary uppercase mb-1">AJUSTE RELÉ TÉRMICO (Ir)</p>
                            <h3 className="text-4xl font-black text-accent tabular-nums">{formatNum(result.relaySetting, 2)} A</h3>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase border-b pb-1 tracking-widest">CONTACTORES (KM)</h4>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 bg-primary/5 rounded-lg border text-center">
                                <span className="block text-[8px] font-bold text-muted-foreground">KM1 (L)</span>
                                <span className="text-xs font-black">{formatNum(result.contactorMain, 1)}A</span>
                              </div>
                              <div className="p-2 bg-primary/5 rounded-lg border text-center">
                                <span className="block text-[8px] font-bold text-muted-foreground">KM2 (Δ)</span>
                                <span className="text-xs font-black">{formatNum(result.contactorDelta, 1)}A</span>
                              </div>
                              <div className="p-2 bg-primary/5 rounded-lg border text-center">
                                <span className="block text-[8px] font-bold text-muted-foreground">KM3 (Y)</span>
                                <span className="text-xs font-black">{formatNum(result.contactorStar, 1)}A</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : activeTab === "proteccion" && typeof result === 'object' && 'nominalCurrent' in result ? (
                        <div className="w-full space-y-6 relative z-10 text-left">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center flex items-center gap-2 justify-center">
                            <ShieldAlert className="h-4 w-4" /> PROTECCIÓN
                          </p>
                          <div className="bg-white p-5 rounded-3xl border-2 border-primary/10 shadow-lg">
                            <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                              {motorProtectionType === 'GUARDAMOTOR' ? 'AJUSTE SUGERIDO (Ir)' : 'CALIBRE DEL INTERRUPTOR'}
                            </span>
                            <h3 className="text-4xl font-black text-primary">
                              {result.protectionSetting === 'range' 
                                ? `${formatNum(result.protectionRange.min, 1)} - ${formatNum(result.protectionRange.max, 1)} A`
                                : `${result.breakerRating} A (Curva D/K)`}
                            </h3>
                            <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-dashed flex items-center gap-3">
                              <Activity className="h-4 w-4 text-primary" />
                              <div>
                                <span className="block text-[10px] font-bold text-muted-foreground">CORRIENTE NOMINAL (In)</span>
                                <span className="text-sm font-black">{formatNum(result.nominalCurrent, 2)} A</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full space-y-4 relative z-10">
                          <p className="text-sm font-bold text-primary uppercase tracking-widest">VALOR RESULTANTE</p>
                          <h3 className="text-6xl md:text-7xl font-black text-primary tabular-nums tracking-tighter">
                            {formatNum(result, 3)}
                            <span className="text-2xl ml-2 text-primary/60">
                              {activeTab === "potencia" ? "W" : activeTab === "corriente" ? "A" : activeTab === "caida" ? "V" : "mm²"}
                            </span>
                          </h3>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-primary/20 text-left space-y-3 z-10">
                      <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                        <Calculator className="h-3.5 w-3.5" /> Transparencia Matemática
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-primary/10 font-mono text-[9px] leading-relaxed">
                        {activeTab === "potencia" && (
                          <div className="space-y-1">
                            <p className="font-bold text-primary">P = {system === 'TRI' ? '√3' : system === 'BI' ? '2' : '1'} × V × I × cosφ</p>
                            <p className="text-muted-foreground">P = {system === 'TRI' ? '1,732' : system === 'BI' ? '2' : '1'} × {v}V × {i}A × {pf}</p>
                          </div>
                        )}
                        {activeTab === "corriente" && (
                          <div className="space-y-1">
                            <p className="font-bold text-primary">I = P / ({system === 'TRI' ? '√3' : system === 'BI' ? '2' : '1'} × V × cosφ)</p>
                            <p className="text-muted-foreground">I = {p}W / ({system === 'TRI' ? '1,732' : system === 'BI' ? '2' : '1'} × {v}V × {pf})</p>
                          </div>
                        )}
                        {activeTab === "seccion" && result?.params && (
                          <div className="space-y-2">
                            <p className="font-bold text-primary">1. Criterio Caída Tensión (ΔV):</p>
                            <p className="text-muted-foreground">S_vd = ({result.params.system === 'TRI' ? '√3' : '2'} × {result.params.L}m × {result.params.I}A × {result.params.pf}) / ({result.params.k} × {formatNum(result.params.Vd, 2)}V)</p>
                            <p className="font-bold text-primary mt-1">2. Criterio Ampacidad (IEC 60364):</p>
                            <p className="text-muted-foreground">S_min para {result.params.I}A × 1,25 (FS)</p>
                            <p className="text-accent font-black mt-1">Resultado: Máximo entre (1) y (2)</p>
                          </div>
                        )}
                        {activeTab === "caida" && (
                          <div className="space-y-1">
                            <p className="font-bold text-primary">ΔV = ({system === 'TRI' ? '√3' : '2'} × L × I × cosφ) / (k × S)</p>
                            <p className="text-muted-foreground">ΔV = ({system === 'TRI' ? '1,732' : '2'} × {length}m × {i}A × {pf}) / ({CONDUCTIVITY[material]} × {section}mm²)</p>
                          </div>
                        )}
                        {activeTab === "climatizacion" && result && (
                          <div className="space-y-2">
                            <p className="font-bold text-primary">Pv (Pérdidas) = P_otros + (kW_vfd × 0,03)</p>
                            {coolingMode === 'AC' ? (
                              <>
                                <p className="font-bold text-primary">P_ac = Pv - (k × A × ΔT)</p>
                                <p className="text-muted-foreground">Pv = {formatNum(result.totalPowerLoss, 1)}W | A = {formatNum(result.surfaceArea, 2)}m² | ΔT = {formatNum(result.deltaT, 1)}K</p>
                              </>
                            ) : (
                              <>
                                <p className="font-bold text-primary">V (Caudal) = (3,1 × P_neto) / ΔT</p>
                                <p className="text-muted-foreground">3,1 = Factor densidad aire (0m snm)</p>
                              </>
                            )}
                          </div>
                        )}
                        {activeTab === "estrella" && (
                          <div className="space-y-2">
                            <p className="font-bold text-primary">In = P / (√3 × V × cosφ × η)</p>
                            <p className="font-bold text-primary">Ir (Relé) = In / √3</p>
                            <p className="text-muted-foreground">In = {p}W / (1,732 × {v}V × {pf} × {parseFloat(eff)/100})</p>
                          </div>
                        )}
                        {activeTab === "proteccion" && (
                          <div className="space-y-2">
                            <p className="font-bold text-primary">In = P / ({system === 'TRI' ? '√3' : '1'} × V × cosφ × η)</p>
                            {motorProtectionType === 'GUARDAMOTOR' ? (
                              <p className="font-bold text-primary">Ajuste = In ± 10%</p>
                            ) : (
                              <p className="font-bold text-primary">Térmica = In × 1,25 (Curva D)</p>
                            )}
                          </div>
                        )}
                        {activeTab === "transmision" && (
                          <div className="space-y-1">
                            <p className="font-bold text-primary">Relación Total (i) = (Z2/Z1) × (Z4/Z3) ...</p>
                            {transMotionType === 'ROTARY' ? (
                               <p className="font-bold text-primary">RPM_final = RPM_motor / i</p>
                            ) : (
                               <p className="font-bold text-primary">V_lineal = (RPM_final / 60) × Paso</p>
                            )}
                          </div>
                        )}
                        {activeTab === "resistencia" && (
                          <div className="space-y-1">
                            <p className="font-bold text-primary">Valor = (B1B2..BN) × 10^B_mult</p>
                            <p className="text-muted-foreground">Basado en código de colores estándar IEC 60062.</p>
                          </div>
                        )}
                      </div>
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
            <h5 className="font-bold text-primary">Cinemática Industrial</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Dimensionamiento de husillos y transmisiones para automatización de alta precisión.</p>
          </div>
        </Card>
        <Card className="p-5 bg-white/40 backdrop-blur-sm border-dashed rounded-2xl flex gap-4 hover:bg-white/60 transition-colors">
          <ShieldCheck className="h-8 w-8 text-accent shrink-0 p-1.5 bg-accent/10 rounded-xl" />
          <div className="text-sm space-y-1">
            <h5 className="font-bold text-primary">Trazabilidad Técnica</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">Fórmulas auditables y transparencia matemática total bajo normativas internacionales.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
