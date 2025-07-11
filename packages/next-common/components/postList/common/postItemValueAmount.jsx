import React from "react";
import { TitleExtraValue, TitleExtra } from "../styled";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import useValueTransferFiatPrice from "./useValueTransferFiatPrice";

export default function PostItemValueAmount({
  amount,
  decimals,
  symbol,
  showFaitPrice,
}) {
  const valueFiatPrice = useValueTransferFiatPrice(amount, decimals, symbol);

  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay
          value={toPrecision(amount, decimals)}
          symbol={symbol}
          tooltipOtherContent={showFaitPrice && valueFiatPrice}
        />
      </TitleExtraValue>
    </TitleExtra>
  );
}
