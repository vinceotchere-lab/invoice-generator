export function toNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function lineAmount(item) {
  return toNumber(item.qty) * toNumber(item.rate);
}

export function computeSubtotal(items) {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

export function computeTaxAmount(subtotal, taxRatePercent) {
  return subtotal * (toNumber(taxRatePercent) / 100);
}

export function computeTotalDue(subtotal, depositPaid, taxAmount) {
  return subtotal - toNumber(depositPaid) + taxAmount;
}

export function formatCurrency(value) {
  const n = toNumber(value);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
