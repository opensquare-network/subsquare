import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ItemWrapper } from "./styled";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

export default function MultiAssetValueItem({
  value,
  assetKind,
  itemName = "Value",
}) {
  const chainSetting = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainSetting.decimals,
    chainSetting.symbol,
  );

  return (
    <ItemWrapper>
      <span>{itemName}:</span>
      <span>
        {toPrecision(value, decimals)} {symbol}
      </span>
    </ItemWrapper>
  );
}
