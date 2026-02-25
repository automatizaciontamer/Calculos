export type SystemType = 'DC' | 'MONO' | 'BI' | 'TRI';

export const CONDUCTIVITY = {
  COBRE: 56,
  ALUMINIO: 35,
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
 * Q = Pv - k * A * ΔT
 */
export const calculatePanelCooling = (
  width: number, // mm
  height: number, // mm
  depth: number, // mm
  powerLoss: number, // W (calor disipado por componentes)
  tInternal: number, // °C
  tExternal: number, // °C
  materialK: number = 5.5 // W/m²K (5.5 para chapa de acero pintada)
) => {
  // Convertir a metros
  const w = width / 1000;
  const h = height / 1000;
  const d = depth / 1000;

  // Área de superficie efectiva (Tablero exento)
  const A = 1.8 * h * (w + d) + 1.4 * w * d;
  
  // Diferencia de temperatura
  const deltaT = tInternal - tExternal;
  
  // Potencia de refrigeración requerida
  const coolingPower = powerLoss - (materialK * A * deltaT);
  
  return {
    coolingPower: Math.max(0, coolingPower),
    surfaceArea: A,
    deltaT: deltaT
  };
};

/**
 * Calcula parámetros para arranque Estrella-Triángulo
 */
export const calculateStarDelta = (nominalCurrent: number) => {
  const iPhase = nominalCurrent / Math.sqrt(3); // Corriente por fase (ajuste relé térmico)
  const iStar = nominalCurrent / 3; // Corriente en estrella
  
  return {
    relaySetting: iPhase,
    contactorMain: iPhase,
    contactorDelta: iPhase,
    contactorStar: iStar
  };
};
