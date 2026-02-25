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
 * IEC 60364-5-52: Selección y montaje de equipos eléctricos - Canalizaciones.
 * Tabla de ampacidad simplificada para Método de Instalación C (Cables sobre pared).
 * Aislamiento PVC 70°C, Temp. ambiente 30°C.
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
 * Cálculo de transmisión mecánica.
 */
export interface TransmissionStage {
  input: number; // Dientes o diámetro entrada
  output: number; // Dientes o diámetro salida
}

export const calculateTransmission = (
  speed: number,
  stages: TransmissionStage[],
  mode: 'FORWARD' | 'REVERSE',
  isLinear: boolean = false,
  lead: number = 5 // Paso en mm/rev (Lead)
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
