import React from "react";
import { useChainSettings } from "../../../../../context/chain";
import { toPrecision } from "../../../../../utils";
import { ItemWrapper } from "./styled";

export default function ValueItem({ value, itemName = "Value" }) {
  const chainSetting = useChainSettings();
  return (
    <ItemWrapper>
      <span>{itemName}:</span>
      <span>
        {toPrecision(value, chainSetting.decimals)} {chainSetting.symbol}
      </span>
    </ItemWrapper>
  );
}
