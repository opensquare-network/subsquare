import React from "react";
import { TitleExtraValue, TitleExtra } from "../styled";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import useFiatValueTooltipContent from "./useFiatValueTooltipContent";

export default function PostItemValueAmount({
  amount,
  decimals,
  symbol,
  showFaitPrice,
}) {
  const fiatValueTooltip = useFiatValueTooltipContent(amount, decimals, symbol);

  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay
          value={toPrecision(amount, decimals)}
          symbol={symbol}
          tooltipOtherContent={showFaitPrice && fiatValueTooltip}
        />
      </TitleExtraValue>
    </TitleExtra>
  );
}
