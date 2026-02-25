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
      // Common bifasica formula (2 phases + neutral): V_line_to_neutral * 2 * current * PF
      // Or V_line_to_line * current * PF. We use V * I * PF * 2 assuming V is phase-neutral.
      return 2 * voltage * current * powerFactor;
    case 'TRI':
      // V is line-to-line voltage
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
      // 2 wires for DC and Monofasica
      return (2 * length * current * powerFactor) / (k * section);
    case 'BI':
      // Assuming balanced system, voltage drop is similar to mono but with PF
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