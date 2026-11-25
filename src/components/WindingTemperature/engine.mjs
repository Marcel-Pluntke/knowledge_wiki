export const COPPER_CONSTANT = 234.5;

export function parseDecimal(value) {
  const text = value.trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) return NaN;
  return Number(text.replace(',', '.'));
}

export function calculateWindingTemperature({coldResistance, warmResistance, coldTemperature, constant = COPPER_CONSTANT, ambientEnd = null}) {
  if (![coldResistance, warmResistance, coldTemperature, constant].every(Number.isFinite)
      || coldResistance <= 0 || warmResistance <= 0 || constant <= 0
      || coldTemperature <= -273.15 || coldTemperature <= -constant
      || (ambientEnd !== null && (!Number.isFinite(ambientEnd) || ambientEnd <= -273.15))) return null;
  const warmTemperature = warmResistance / coldResistance * (constant + coldTemperature) - constant;
  if (!Number.isFinite(warmTemperature) || warmTemperature <= -273.15) return null;
  return {
    warmTemperature,
    changeFromCold: warmTemperature - coldTemperature,
    temperatureRise: ambientEnd === null ? null : warmTemperature - ambientEnd,
  };
}
