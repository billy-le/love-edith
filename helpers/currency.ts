import currency from 'currency.js';

export function PHP(value: currency.Any) {
  return currency(value, { symbol: 'P', decimal: '.', separator: ',', precision: 2 });
}
