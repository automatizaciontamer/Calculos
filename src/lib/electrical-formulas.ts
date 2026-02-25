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
  // Convertir a metros
  const w = width / 1000;
  const h = height / 1000;
  const d = depth / 1000;

  // Cálculo de Superficie Efectiva (A) según tipo de instalación
  let A = 0;
  switch (installation) {
    case 'FREE': // Exento (Todas las caras libres)
      A = 1.8 * h * (w + d) + 1.4 * w * d;
      break;
    case 'WALL': // Contra pared (Espalda cubierta)
      A = 1.4 * w * h + 0.7 * w * d + 1.8 * d * h;
      break;
    case 'ROW': // En fila (Lados cubiertos)
      A = 1.4 * w * h + 1.4 * w * d + 0.9 * d * h;
      break;
    case 'RECESSED': // Empotrado (Solo frontal libre)
      A = 1.4 * w * h + 0.7 * w * d;
      break;
  }
  
  // Pérdidas por Variadores (aprox 3% de la potencia nominal)
  const vfdLosses = vfdCount * (vfdPowerKw * 1000) * 0.03;
  const totalPowerLoss = otherPowerLoss + vfdLosses;
  
  // Diferencia de temperatura
  const deltaT = tInternal - tExternal;
  
  // Coeficiente del material
  const k = MATERIAL_K[materialKey];
  
  // Potencia de refrigeración requerida Q = Pv - k * A * ΔT
  const coolingPower = totalPowerLoss - (k * A * deltaT);
  
  return {
    coolingPower: Math.max(0, coolingPower),
    totalPowerLoss,
    vfdLosses,
    surfaceArea: A,
    deltaT: deltaT
  };
};

export const calculateStarDelta = (nominalCurrent: number) => {
  const iPhase = nominalCurrent / Math.sqrt(3);
  const iStar = nominalCurrent / 3;
  
  return {
    relaySetting: iPhase,
    contactorMain: iPhase,
    contactorDelta: iPhase,
    contactorStar: iStar
  };
};