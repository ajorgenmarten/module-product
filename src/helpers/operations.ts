import { round } from './round';

function operationData(n1: number, n2: number) {
  const decimals1 = n1.toString().split('.')[1] ?? '';
  const decimals2 = n2.toString().split('.')[1] ?? '';

  const exponent =
    decimals1.length > decimals2.length ? decimals1.length : decimals2.length;
  const factor = 10 ** exponent;

  const factorN1 = round(n1 * factor);
  const factorN2 = round(n2 * factor);

  return { factor, factorN1, factorN2 };
}

export function sum(n1: number, n2: number) {
  const { factorN1, factorN2, factor } = operationData(n1, n2);
  return (factorN1 + factorN2) / factor;
}

export function rest(n1: number, n2: number) {
  const { factorN1, factorN2, factor } = operationData(n1, n2);
  return (factorN1 - factorN2) / factor;
}

export function multiplication(n1: number, n2: number) {
  const { factorN1, factorN2, factor } = operationData(n1, n2);
  return (factorN1 * factorN2) / factor ** 2;
}

export function division(n1: number, n2: number) {
  const { factorN1, factorN2, factor } = operationData(n1, n2);
  return factorN1 / factorN2;
}
