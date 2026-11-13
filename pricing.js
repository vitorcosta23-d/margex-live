'use strict';
(function exposePricing(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MargeXPricing = api;
})(globalThis, function createPricing() {
  const DATA = Object.freeze({
    referencePriceCents: 18990,
    initialPriceCents: 18990,
    finalPriceCents: 15928,
    productCostCents: 10000,
    fixedCostCents: 990,
    feeBasisPoints: 2100,
    commissionBasisPoints: 1500,
    taxBasisPoints: 600,
    competitorsCents: Object.freeze([17490, 17990, 18490])
  });
  function calculateOffer(priceCents, parameters = DATA) {
    const { referencePriceCents, productCostCents, fixedCostCents, feeBasisPoints } = parameters;
    for (const value of [priceCents, referencePriceCents, productCostCents, fixedCostCents, feeBasisPoints]) {
      if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Valores devem ser inteiros não negativos.');
    }
    if (referencePriceCents === 0 || priceCents === 0 || feeBasisPoints > 10000) throw new RangeError('Preço e referência devem ser positivos; taxa deve estar entre 0 e 100%.');
    const feesCents = Math.round(priceCents * feeBasisPoints / 10000);
    const profitCents = priceCents - productCostCents - fixedCostCents - feesCents;
    return Object.freeze({
      priceCents,
      feesCents,
      totalCostCents: productCostCents + fixedCostCents + feesCents,
      profitCents,
      discountRate: (referencePriceCents - priceCents) / referencePriceCents,
      marginRate: profitCents / priceCents
    });
  }
  function priceAtProgress(progress, data = DATA) {
    if (!Number.isFinite(progress)) throw new RangeError('Progresso inválido.');
    const bounded = Math.min(1, Math.max(0, progress));
    return Math.round(data.initialPriceCents + (data.finalPriceCents - data.initialPriceCents) * bounded);
  }
  return Object.freeze({ DATA, calculateOffer, priceAtProgress });
});
