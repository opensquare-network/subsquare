import { Value } from "./styled";
import DisplayValue from "next-common/components/displayValue";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

export default function SymbolValue({ value = 0 }) {
  const { decimals, symbol } = useChainSettings();
  const nValue = toPrecision(value || 0, decimals);
  const { width } = useWindowSize();

  return (
    <Value>
      <DisplayValue value={nValue} symbol={symbol} noWrap={width <= 1024} />
    </Value>
  );
}
