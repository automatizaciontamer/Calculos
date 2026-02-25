export type SystemType = 'DC' | 'MONO' | 'BI' | 'TRI';

/** 
 * IEC 60228: Conductores de cables aislados. 
 * Valores de conductividad estándar a 20°C.
 */
export const CONDUCTIVITY = {
  COBRE: 56, // MS/m
  ALUMINIO: 35, // MS/m
};

/**
 * IEC 60890: Método de verificación del aumento de temperatura.
 * Coeficientes de transmisión térmica k (W/m²·K).
 */
export const MATERIAL_K = {
  CHAPA_PINTADA: 5.5,
  ACERO_INOX: 3.7,
  ALUMINIO: 12.0,
  PLASTICO: 3.5,
};

export type InstallationType = 'FREE' | 'WALL' | 'ROW' | 'RECESSED';

/**
 * Secciones comerciales normalizadas (mm²) según IEC 60228 / IRAM 2178.
 */
export const COMMERCIAL_SECTIONS = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300
];

/**
 * Calibres comerciales estándar para interruptores termomagnéticos (A).
 */
export const BREAKER_RATINGS = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125
];

/**
 * IEC 60364-5-52: Selección y montaje de equipos eléctricos - Canalizaciones.
 */
const IEC_AMPACITY_TABLE = [
  { section: 1.5, current: 14.5 },
  { section: 2.5, current: 19.5 },
  { section: 4, current: 26 },
  { section: 6, current: 34 },
  { section: 10, current: 46 },
  { section: 16, current: 61 },
  { section: 25, current: 80 },
  { section: 35, current: 99 },
  { section: 50, current: 119 },
  { section: 70, current: 151 },
  { section: 95, current: 182 },
  { section: 120, current: 210 },
  { section: 150, current: 240 },
  { section: 185, current: 273 },
  { section: 240, current: 321 },
  { section: 300, current: 367 },
];

const getCommercialSection = (calculated: number): number => {
  const match = COMMERCIAL_SECTIONS.find(s => s >= calculated);
  return match || COMMERCIAL_SECTIONS[COMMERCIAL_SECTIONS.length - 1];
};

const getAmpacitySection = (current: number): number => {
  const safetyFactor = 1.25;
  const targetCurrent = current * safetyFactor;
  const match = IEC_AMPACITY_TABLE.find(entry => entry.current >= targetCurrent);
  return match ? match.section : IEC_AMPACITY_TABLE[IEC_AMPACITY_TABLE.length - 1].section;
};

export const calculatePower = (
  voltage: number,
  current: number,
  system: SystemType,
  powerFactor: number = 1
): number => {
  switch (system) {
    case 'DC':
      return voltage * current;
    case 'MONO':
      return voltage * current * powerFactor;
    case 'BI':
      return 2 * voltage * current * powerFactor;
    case 'TRI':
      return Math.sqrt(3) * voltage * current * powerFactor;
    default:
      return 0;
  }
};

export const calculateCurrent = (
  power: number,
  voltage: number,
  system: SystemType,
  powerFactor: number = 1
): number => {
  if (voltage === 0) return 0;
  switch (system) {
    case 'DC':
      return power / voltage;
    case 'MONO':
      return power / (voltage * powerFactor);
    case 'BI':
      return power / (2 * voltage * powerFactor);
    case 'TRI':
      return power / (Math.sqrt(3) * voltage * powerFactor);
    default:
      return 0;
  }
};

export const calculateVoltageDrop = (
  current: number,
  length: number,
  section: number,
  system: SystemType,
  material: keyof typeof CONDUCTIVITY = 'COBRE',
  powerFactor: number = 1
): number => {
  if (section === 0) return 0;
  const k = CONDUCTIVITY[material];
  
  switch (system) {
    case 'DC':
    case 'MONO':
      return (2 * length * current * powerFactor) / (k * section);
    case 'BI':
      return (2 * length * current * powerFactor) / (k * section);
    case 'TRI':
      return (Math.sqrt(3) * length * current * powerFactor) / (k * section);
    default:
      return 0;
  }
};

export const calculateCableSection = (
  current: number,
  length: number,
  maxVoltageDrop: number,
  system: SystemType,
  material: keyof typeof CONDUCTIVITY = 'COBRE',
  powerFactor: number = 1,
  includeNeutral: boolean = false,
  isSingleCore: boolean = false
) => {
  if (maxVoltageDrop === 0) return { section: 0, commercial: 0, formation: '' };
  const k = CONDUCTIVITY[material];
  
  let calculated = 0;
  switch (system) {
    case 'DC':
    case 'MONO':
    case 'BI':
      calculated = (2 * length * current * powerFactor) / (k * maxVoltageDrop);
      break;
    case 'TRI':
      calculated = (Math.sqrt(3) * length * current * powerFactor) / (k * maxVoltageDrop);
      break;
  }

  const ampacitySection = getAmpacitySection(current);
  const finalCalculated = Math.max(calculated, ampacitySection);
  const commercial = getCommercialSection(finalCalculated);

  let formation = "";
  const groundText = " + PE";
  const neutralText = includeNeutral ? " + N" : "";

  switch (system) {
    case 'DC':
      formation = isSingleCore ? `2x (1x${commercial})` : `2x${commercial}`;
      break;
    case 'MONO':
    case 'BI':
      formation = isSingleCore ? `2x (1x${commercial})` + groundText : `3x${commercial}`;
      break;
    case 'TRI':
      if (isSingleCore) {
        formation = includeNeutral ? `4x (1x${commercial})` + groundText : `3x (1x${commercial})` + groundText;
      } else {
        formation = includeNeutral ? `5x${commercial}` : `4x${commercial}`;
      }
      break;
  }

  const descriptiveLabel = system === 'TRI' 
    ? (includeNeutral ? "3P + N + T" : "3P + T")
    : (system === 'DC' ? "2P" : "1P + N + T");

  return {
    section: finalCalculated,
    commercial,
    formation,
    descriptiveLabel,
    isSingleCore
  };
};

export const calculatePanelCooling = (
  width: number,
  height: number,
  depth: number,
  otherPowerLoss: number,
  vfdCount: number,
  vfdPowerKw: number,
  tInternal: number,
  tExternal: number,
  materialKey: keyof typeof MATERIAL_K,
  installation: InstallationType
) => {
  const w = width / 1000;
  const h = height / 1000;
  const d = depth / 1000;

  let A = 0;
  switch (installation) {
    case 'FREE': 
      A = 1.8 * h * (w + d) + 1.4 * w * d;
      break;
    case 'WALL': 
      A = 1.4 * w * h + 0.7 * w * d + 1.8 * d * h;
      break;
    case 'ROW': 
      A = 1.4 * w * h + 1.4 * w * d + 0.9 * d * h;
      break;
    case 'RECESSED': 
      A = 1.4 * w * h + 0.7 * w * d;
      break;
  }
  
  const vfdLosses = vfdCount * (vfdPowerKw * 1000) * 0.03;
  const totalPowerLoss = otherPowerLoss + vfdLosses;
  const deltaT = tInternal - tExternal;
  const k = MATERIAL_K[materialKey];
  
  const coolingPower = totalPowerLoss - (k * A * deltaT);
  
  return {
    coolingPower: Math.max(0, coolingPower),
    totalPowerLoss,
    vfdLosses,
    surfaceArea: A,
    deltaT: deltaT
  };
};

export const calculateStarDelta = (
  power: number,
  voltage: number,
  pf: number,
  efficiency: number
) => {
  const denominator = Math.sqrt(3) * voltage * pf * (efficiency / 100);
  const nominalCurrent = denominator > 0 ? power / denominator : 0;
  const iPhase = nominalCurrent / Math.sqrt(3);
  const iStar = nominalCurrent / 3;
  const sectionMain = getAmpacitySection(nominalCurrent);
  const sectionMotor = getAmpacitySection(iPhase);
  
  return {
    nominalCurrent,
    relaySetting: iPhase,
    contactorMain: iPhase,
    contactorDelta: iPhase,
    contactorStar: iStar,
    sectionMain,
    sectionMotor
  };
};

/**
 * Cálculo de protección DOL (Arranque Directo).
 */
export const calculateMotorProtection = (
  power: number,
  voltage: number,
  pf: number,
  efficiency: number,
  type: 'GUARDAMOTOR' | 'TERMOMAGNETICA',
  system: SystemType = 'TRI'
) => {
  const denominator = system === 'TRI' 
    ? Math.sqrt(3) * voltage * pf * (efficiency / 100)
    : voltage * pf * (efficiency / 100);
  
  const nominalCurrent = denominator > 0 ? power / denominator : 0;
  const section = getAmpacitySection(nominalCurrent);
  
  let protectionSetting = "";
  if (type === 'GUARDAMOTOR') {
    // Rango sugerido +/- 10%
    const min = nominalCurrent * 0.9;
    const max = nominalCurrent * 1.1;
    protectionSetting = `${min.toFixed(1)} - ${max.toFixed(1)} A`;
  } else {
    // Termomagnética curva D o K (1.25x In para evitar disparo por arranque)
    const target = nominalCurrent * 1.25;
    const rating = BREAKER_RATINGS.find(r => r >= target) || BREAKER_RATINGS[BREAKER_RATINGS.length - 1];
    protectionSetting = `${rating} A (Curva D/K)`;
  }

  return {
    nominalCurrent,
    protectionSetting,
    section,
    commercialSection: getCommercialSection(section)
  };
};

export interface TransmissionStage {
  input: number;
  output: number;
}

export const calculateTransmission = (
  speed: number,
  stages: TransmissionStage[],
  mode: 'FORWARD' | 'REVERSE',
  isLinear: boolean = false,
  lead: number = 5
) => {
  let totalRatio = 1;
  stages.forEach(stage => {
    if (stage.input > 0 && stage.output > 0) {
      totalRatio *= (stage.output / stage.input);
    }
  });

  let resultValue = 0;
  
  if (!isLinear) {
    if (mode === 'FORWARD') {
      resultValue = totalRatio > 0 ? speed / totalRatio : 0;
    } else {
      resultValue = speed * totalRatio;
    }
  } else {
    if (mode === 'FORWARD') {
      const outputRps = (speed / 60) * (1 / totalRatio);
      resultValue = outputRps * lead;
    } else {
      const outputRps = speed / lead;
      resultValue = outputRps * totalRatio * 60;
    }
  }

  return {
    resultValue,
    totalRatio,
    stagesCount: stages.length,
    isLinear
  };
};

/**
 * Código de colores para resistencias.
 */
export const RESISTOR_COLORS = [
  { color: 'black', label: 'Negro', value: 0, multiplier: 1, tolerance: null, hex: '#000000' },
  { color: 'brown', label: 'Marrón', value: 1, multiplier: 10, tolerance: 1, hex: '#8B4513' },
  { color: 'red', label: 'Rojo', value: 2, multiplier: 100, tolerance: 2, hex: '#FF0000' },
  { color: 'orange', label: 'Naranja', value: 3, multiplier: 1000, tolerance: null, hex: '#FFA500' },
  { color: 'yellow', label: 'Amarillo', value: 4, multiplier: 10000, tolerance: null, hex: '#FFFF00' },
  { color: 'green', label: 'Verde', value: 5, multiplier: 100000, tolerance: 0.5, hex: '#008000' },
  { color: 'blue', label: 'Azul', value: 6, multiplier: 1000000, tolerance: 0.25, hex: '#0000FF' },
  { color: 'violet', label: 'Violeta', value: 7, multiplier: 10000000, tolerance: 0.1, hex: '#EE82EE' },
  { color: 'grey', label: 'Gris', value: 8, multiplier: null, tolerance: 0.05, hex: '#808080' },
  { color: 'white', label: 'Blanco', value: 9, multiplier: null, tolerance: null, hex: '#FFFFFF' },
  { color: 'gold', label: 'Oro', value: null, multiplier: 0.1, tolerance: 5, hex: '#FFD700' },
  { color: 'silver', label: 'Plata', value: null, multiplier: 0.01, tolerance: 10, hex: '#C0C0C0' },
];

export const calculateResistor = (bands: string[]) => {
  const colors = bands.map(b => RESISTOR_COLORS.find(c => c.color === b)!);
  
  if (bands.length === 4) {
    const value = (colors[0].value! * 10 + colors[1].value!) * colors[2].multiplier!;
    const tolerance = colors[3].tolerance;
    return { value, tolerance };
  } else {
    const value = (colors[0].value! * 100 + colors[1].value! * 10 + colors[2].value!) * colors[3].multiplier!;
    const tolerance = colors[4].tolerance;
    return { value, tolerance };
  }
};
