export type SystemType = 'DC' | 'MONO' | 'BI' | 'TRI';

export const CONDUCTIVITY = {
  COBRE: 56,
  ALUMINIO: 35,
};

export const MATERIAL_K = {
  CHAPA_PINTADA: 5.5,
  ACERO_INOX: 3.7,
  ALUMINIO: 12.0,
  PLASTICO: 3.5,
};

export type InstallationType = 'FREE' | 'WALL' | 'ROW' | 'RECESSED';

// Tabla simplificada de ampacidad basada en IEC 60364-5-52 
// (Método C: Cables sobre pared de madera/mampostería, Cobre, PVC)
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

const getIECSection = (current: number): number => {
  const safetyFactor = 1.25; // Factor de seguridad estándar para motores
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
  powerFactor: number = 1
): number => {
  if (maxVoltageDrop === 0) return 0;
  const k = CONDUCTIVITY[material];
  
  switch (system) {
    case 'DC':
    case 'MONO':
      return (2 * length * current * powerFactor) / (k * maxVoltageDrop);
    case 'BI':
      return (2 * length * current * powerFactor) / (k * maxVoltageDrop);
    case 'TRI':
      return (Math.sqrt(3) * length * current * powerFactor) / (k * maxVoltageDrop);
    default:
      return 0;
  }
};

/**
 * Calcula la potencia de refrigeración necesaria para un tablero eléctrico.
 */
export const calculatePanelCooling = (
  width: number, // mm
  height: number, // mm
  depth: number, // mm
  otherPowerLoss: number, // W
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
  
  // Corriente de fase (por los devanados en Delta): In / sqrt(3)
  const iPhase = nominalCurrent / Math.sqrt(3);
  // Corriente en el contactor de Estrella: In / 3
  const iStar = nominalCurrent / 3;

  // Dimensionamiento de conductores IEC 60364
  // 1. Cables de línea (alimentación tablero): Soportan In
  const sectionMain = getIECSection(nominalCurrent);
  // 2. Cables de motor (6 hilos): Soportan In / sqrt(3)
  const sectionMotor = getIECSection(iPhase);
  
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
