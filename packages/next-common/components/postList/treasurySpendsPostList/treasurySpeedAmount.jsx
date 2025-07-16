import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { getAssetByMeta } from "next-common/utils/treasury/spend/usdCheck";
import { PostItemValueAmount } from "next-common/components/postList/common";

export default function TreasurySpendAmount({ meta }) {
  const chainSettings = useChainSettings();
  const { amount } = meta;
  const asset = getAssetByMeta(meta, chainSettings);
  if (!asset) {
    return null;
  }

  return (
    <PostItemValueAmount
      amount={amount}
      symbol={asset.symbol}
      decimals={asset.decimals}
    />
  );
}
