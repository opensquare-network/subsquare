import React from "react";
import { TitleExtraValue, TitleExtra } from "../styled";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import ValueFiatPriceDisplay from "./valueFiatPriceDisplay";

export default function PostItemValueAmount({
  amount,
  decimals,
  symbol,
  showFaitPrice,
}) {
  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay
          value={toPrecision(amount, decimals)}
          symbol={symbol}
          tooltipOtherContent={
            showFaitPrice && (
              <ValueFiatPriceDisplay amount={amount} symbol={symbol} />
            )
          }
        />
      </TitleExtraValue>
    </TitleExtra>
  );
}
