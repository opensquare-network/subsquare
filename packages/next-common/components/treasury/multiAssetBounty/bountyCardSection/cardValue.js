import React from "react";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

function MultiAssetBountyCardValue({ value, assetKind }) {
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );

  if (value == null) return null;

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export default React.memo(MultiAssetBountyCardValue);
