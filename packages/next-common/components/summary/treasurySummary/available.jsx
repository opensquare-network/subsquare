import { useChainSettings } from "next-common/context/chain";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";
import TreasurySummaryFiatPriceLabel from "./fiatPriceLabel";
import isNil from "lodash.isnil";

export default function TreasurySummaryAvailable({ free = 0, fiatPrice }) {
  const { decimals, symbol } = useChainSettings();

  const value = toPrecision(free || 0, decimals);

  return (
    <div>
      <div className="flex gap-x-1">
        <span>{abbreviateBigNumber(value)}</span>
        <span className="unit upper">{symbol}</span>
      </div>

      {!isNil(fiatPrice) && (
        <TreasurySummaryFiatPriceLabel value={value} fiatPrice={fiatPrice} />
      )}
    </div>
  );
}
