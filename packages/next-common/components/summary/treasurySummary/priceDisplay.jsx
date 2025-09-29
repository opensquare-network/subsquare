import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { useMemo } from "react";

export default function PriceDisplay({
  value,
  showExtraInfo = true,
  showTooltip = true,
  valueClassName = "",
}) {
  const { decimals, symbol } = useChainSettings();
  const { price: fiatPrice } = useFiatPriceSnapshot();

  const totalPrice = useMemo(() => {
    if (isNil(fiatPrice)) {
      return null;
    }

    return BigNumber(value)
      .dividedBy(Math.pow(10, decimals))
      .multipliedBy(fiatPrice);
  }, [value, decimals, fiatPrice]);

  if (isNil(totalPrice)) {
    return (
      <ValueDisplay
        value={toPrecision(value, decimals)}
        symbol={symbol}
        showTooltip={showTooltip}
        className={valueClassName}
      />
    );
  }

  return (
    <>
      <ValueDisplay
        value={toPrecision(totalPrice)}
        symbol={""}
        prefix={"$"}
        showTooltip={showTooltip}
        className={valueClassName}
      />
      {showExtraInfo && (
        <div className="text12Medium text-textTertiary">
          <ValueDisplay
            value={toPrecision(value, decimals)}
            symbol={symbol}
            showTooltip={showTooltip}
            className={valueClassName}
          />
        </div>
      )}
    </>
  );
}
