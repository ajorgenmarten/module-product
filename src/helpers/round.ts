export function round(number: number, precision: number = 0) {
  if (precision < 0) throw new Error('La precisión debe ser mayor o igual a 0');
  
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}