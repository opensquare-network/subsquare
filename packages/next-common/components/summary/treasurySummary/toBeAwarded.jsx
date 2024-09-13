import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TreasurySummaryFiatPriceLabel from "./fiatPriceLabel";

export default function TreasurySummaryToBeAwarded({ toBeAwarded, fiatPrice }) {
  const { decimals, symbol } = useChainSettings();

  const value = toPrecision(toBeAwarded || 0, decimals);

  return (
    <div>
      <ValueDisplay
        showApproximationSymbol={false}
        value={value}
        symbol={symbol}
      />

      {!isNil(fiatPrice) && (
        <TreasurySummaryFiatPriceLabel value={value} fiatPrice={fiatPrice} />
      )}
    </div>
  );
}
