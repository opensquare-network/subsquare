import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function ToBeAwarded({ toBeAwarded, fiatPrice }) {
  const { decimals, symbol } = useChainSettings();

  const value = toPrecision(toBeAwarded || 0, decimals);

  return (
    <span className="!inline">
      <ValueDisplay
        showApproximationSymbol={false}
        value={value}
        symbol={symbol}
        className={"text12Medium text-textPrimary"}
      />
    </span>
  );
}
