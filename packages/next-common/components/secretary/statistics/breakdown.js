import BigNumber from "bignumber.js";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";

export function getCyclesTotal(cycles) {
  let totalUsdt = new BigNumber(0);
  let totalHollar = new BigNumber(0);

  (cycles || []).forEach((item) => {
    const registered = normalizeSalaryAssetValue(item.registeredPaid || {});
    const unRegistered = normalizeSalaryAssetValue(item.unRegisteredPaid || {});
    totalUsdt = totalUsdt
      .plus(registered.usdt || 0)
      .plus(unRegistered.usdt || 0);
    totalHollar = totalHollar
      .plus(registered.hollar || 0)
      .plus(unRegistered.hollar || 0);
  });

  return {
    usdt: totalUsdt,
    hollar: totalHollar,
  };
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
