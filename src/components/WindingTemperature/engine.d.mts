export const COPPER_CONSTANT: number;
export function parseDecimal(value: string): number;
export function calculateWindingTemperature(input: {
  coldResistance: number; warmResistance: number; coldTemperature: number; constant?: number; ambientEnd?: number | null;
}): {warmTemperature: number; changeFromCold: number; temperatureRise: number | null} | null;
