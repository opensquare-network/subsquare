import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { Value } from "next-common/components/referenda/tally/styled";

export default function SymbolValue({ value = 0, className }) {
  const { decimals, symbol } = useChainSettings();
  const nValue = toPrecision(value || 0, decimals);

  return (
    <Value>
      <ValueDisplay value={nValue} symbol={symbol} className={className} />
    </Value>
  );
}
