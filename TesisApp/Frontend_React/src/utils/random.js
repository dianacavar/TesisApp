import { FIELD_VALUES, FIXED_FIELDS } from '../data/formOptions';

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Genera un objeto con valores aleatorios válidos para todos los campos
 * que espera el modelo (incluyendo los campos fijos).
 */
export function generateRandomInput() {
  const data = { ...FIXED_FIELDS };
  for (const [name, values] of Object.entries(FIELD_VALUES)) {
    data[name] = pickRandom(values);
  }
  return data;
}

export function generateRandomInputs(n) {
  return Array.from({ length: n }, () => generateRandomInput());
}
