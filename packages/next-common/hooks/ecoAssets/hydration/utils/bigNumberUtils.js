import BigNumber from "bignumber.js";
import { BN } from "@polkadot/util";
import { BN_NAN, TRILL, QUINTILL } from "./constants";

export function normalizeBigNumber(value) {
  if (value == null) return null;

  if (BigNumber.isBigNumber(value)) return value;

  if (BN.isBN(value)) return new BigNumber(value.toString());

  return new BigNumber(value);
}

/**
 * @param amount value to scale
 * @param decimals number of shifted places
 * @returns The shift is of the decimal point, i.e. of powers of ten, and is to the right.
 * eg.: 1.23456789 => 123456789
 */
export const scale = (amount, decimals) => {
  if (!amount) return BN_NAN;

  const _decimals =
    decimals === "t" ? TRILL : decimals === "q" ? QUINTILL : decimals;

  return normalizeBigNumber(amount).shiftedBy(_decimals);
};

export const scaleHuman = (amount, decimals) => {
  if (!amount) return BN_NAN;

  const _decimals =
    decimals === "t" ? TRILL : decimals === "q" ? QUINTILL : decimals;

  return normalizeBigNumber(amount).shiftedBy(-_decimals);
};
