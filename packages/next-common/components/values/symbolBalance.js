import { useChainSettings } from "../../context/chain";
import { toPrecision } from "../../utils";
import isNil from "lodash.isnil";
import BigNumber from "bignumber.js";

export default function SymbolBalance({ value = 0, fixed }) {
  const { decimals, symbol } = useChainSettings();

  let normalizedValue = toPrecision(value, decimals);
  if (!isNil(fixed)) {
    if (!Number.isInteger(fixed)) {
      throw new Error(`Invalid fixed value: ${fixed}`);
    }

    normalizedValue = new BigNumber(normalizedValue).toFixed(fixed, 1);
  }

  return `${normalizedValue} ${symbol}`;
}
