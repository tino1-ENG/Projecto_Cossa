/**
 * Mozambican Metical (MZN) Money Utilities
 * Rule: Money is stored as integer centavos (1 MZN = 100 centavos)
 */

export function formatMoneyDigits(centavos: number | undefined | null): string {
  if (centavos === undefined || centavos === null || isNaN(centavos)) {
    return '0';
  }
  const meticais = Math.round(centavos / 100);
  return meticais.toLocaleString('en-US'); // Comma separator: 18,450,000 as in design
}

export function formatMoney(centavos: number | undefined | null, includeDecimals = false): string {
  if (centavos === undefined || centavos === null || isNaN(centavos)) {
    return '0 MZN';
  }

  const meticais = centavos / 100;
  const formatted = meticais.toLocaleString('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  });

  return `${formatted} MZN`;
}

export function formatMoneyCompact(centavos: number | undefined | null): string {
  if (!centavos || isNaN(centavos)) return '0 MZN';
  const meticais = centavos / 100;

  if (meticais >= 1_000_000) {
    return `${(meticais / 1_000_000).toFixed(2).replace(/\.00$/, '')}M MZN`;
  }
  if (meticais >= 1_000) {
    return `${(meticais / 1_000).toFixed(0)}k MZN`;
  }
  return `${meticais.toLocaleString('en-US')} MZN`;
}

export function meticaisToCentavos(meticais: number | string): number {
  const numeric = typeof meticais === 'string' ? parseFloat(meticais.replace(/\s+/g, '').replace(',', '.')) : meticais;
  if (isNaN(numeric) || numeric < 0) return 0;
  return Math.round(numeric * 100);
}

export function centavosToMeticais(centavos: number): number {
  return centavos / 100;
}
