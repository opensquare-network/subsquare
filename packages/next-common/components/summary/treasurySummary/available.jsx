import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import FiatPriceLabel from "./fiatPriceLabel";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";

export default function TreasurySummaryAvailable({ free = 0, fiatPrice }) {
  const { decimals, symbol } = useChainSettings();

  const value = toPrecision(free || 0, decimals);

  return (
    <div>
      <ValueDisplay
        showApproximationSymbol={false}
        value={value}
        symbol={symbol}
      />

      {!isNil(fiatPrice) && (
        <FiatPriceLabel value={value} fiatPrice={fiatPrice} />
      )}
    </div>
  );
}
