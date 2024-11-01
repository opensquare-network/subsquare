import BigNumber from "bignumber.js";

export function getCoretimeLeadinFactorAt(when) {
  if (when <= 0.5) {
    return 100 - 180 * when;
  } else {
    return 19 - when * 18;
  }
}

// https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/broker/src/utility_impls.rs#L63
export function getCoretimePriceAt(blockHeight, saleInfo) {
  const { saleStart, leadinLength, price, endPrice } = saleInfo;
  const percentageOfLeadin = Math.min(blockHeight - saleStart, leadinLength);
  const through = percentageOfLeadin / leadinLength;
  const factor = getCoretimeLeadinFactorAt(through);
  return BigNumber(factor).multipliedBy(endPrice || price).toFixed();
}
