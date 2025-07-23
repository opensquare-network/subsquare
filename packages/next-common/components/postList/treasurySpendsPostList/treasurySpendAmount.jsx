import React from "react";
import { PostItemValueAmount } from "next-common/components/postList/common";
import { useChainSettings } from "next-common/context/chain";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function TreasurySpendAmount({ extractedTreasuryInfo }) {
  let { decimals } = useChainSettings();

  if (!extractedTreasuryInfo) {
    return null;
  }

  const { assetKind, amount } = extractedTreasuryInfo;
  const type = assetKind?.type;
  const symbol = assetKind?.symbol;
  if (type !== "native") {
    decimals = SYMBOL_DECIMALS[symbol];
  }

  return (
    <PostItemValueAmount amount={amount} symbol={symbol} decimals={decimals} />
  );
}
