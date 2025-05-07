export function round10(value: number, exp: number): number {
  if (!exp) {
    return Math.round(value);
  }
  
  value = Number(value);
  exp = Number(exp);
  
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }

  // Shift
  const valueStr = value.toString().split('e');
  value = Math.round(Number(valueStr[0] + 'e' + (valueStr[1] ? (+valueStr[1] - exp) : -exp)));
  
  // Shift back
  const valStr = value.toString().split('e');
  return Number(valStr[0] + 'e' + (valStr[1] ? (+valStr[1] + exp) : exp));
}