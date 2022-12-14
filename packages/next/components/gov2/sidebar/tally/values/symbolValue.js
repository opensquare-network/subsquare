import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { Value } from "next-common/components/referenda/tally/styled";

export default function SymbolValue({ value = 0 }) {
  const { decimals, symbol } = useChainSettings();
  const nValue = toPrecision(value || 0, decimals);
  const { width } = useWindowSize();

  return (
    <Value>
      <ValueDisplay value={nValue} symbol={symbol} noWrap={width <= 1024} />
    </Value>
  );
}
