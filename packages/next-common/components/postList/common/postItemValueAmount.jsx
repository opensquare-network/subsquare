import React from "react";
import { TitleExtraValue, TitleExtra } from "../styled";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import useTokenFiatValue from "next-common/hooks/balance/useTokenFiatValue";

export default function PostItemValueAmount({
  amount,
  decimals,
  symbol,
  showFaitPrice,
}) {
  const valueFiatPrice = useTokenFiatValue(amount, symbol);
  const formattedFiatValue = valueFiatPrice && `( ≈ $${valueFiatPrice} )`;
  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay
          value={toPrecision(amount, decimals)}
          symbol={symbol}
          tooltipOtherContent={showFaitPrice && formattedFiatValue}
        />
      </TitleExtraValue>
    </TitleExtra>
  );
}
