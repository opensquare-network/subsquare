import BigNumber from "bignumber.js";

export function getCyclesTotal(cycles) {
  if (!cycles || cycles.length === 0) {
    return new BigNumber(0);
  }
  return cycles.reduce((total, item) => {
    const registeredPaid = new BigNumber(item.registeredPaid || 0);
    const unRegisteredPaid = new BigNumber(item.unRegisteredPaid || 0);
    return total.plus(registeredPaid).plus(unRegisteredPaid);
  }, new BigNumber(0));
}

export function getReferendaTotal(paymentReferenda) {
  if (!paymentReferenda || paymentReferenda.length === 0) {
    return new BigNumber(0);
  }
  return paymentReferenda.reduce((total, item) => {
    return total.plus(new BigNumber(item.value || 0));
  }, new BigNumber(0));
}

export function getReferendaUsd(paymentReferenda) {
  if (!paymentReferenda || paymentReferenda.length === 0) {
    return new BigNumber(0);
  }
  return paymentReferenda.reduce((total, ref) => {
    const value = new BigNumber(ref.value || 0);
    const amount = value.div(Math.pow(10, ref.decimals || 10));
    return total.plus(amount.times(ref.price || 0));
  }, new BigNumber(0));
}

export function getReferendaTotalByAddress(paymentReferenda, address) {
  const refs = (paymentReferenda || []).filter(
    (r) => r.beneficiary === address,
  );
  return getReferendaTotal(refs);
}

export function getReferendaUsdByAddress(paymentReferenda, address) {
  const refs = (paymentReferenda || []).filter(
    (r) => r.beneficiary === address,
  );
  return getReferendaUsd(refs);
}
