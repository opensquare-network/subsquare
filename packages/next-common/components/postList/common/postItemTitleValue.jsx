import React from "react";
import { TitleExtra } from "../styled";
import { isNil } from "lodash-es";
import PostListTreasuryAllSpends from "next-common/components/postList/treasuryAllSpends";
import { useChainSettings } from "next-common/context/chain";
import PostItemValueAmount from "./postItemValueAmount";

export default function PostItemTitleValue({ data, showFaitPrice }) {
  const { decimals, symbol } = useChainSettings(data.indexer?.blockHeight);
  const { onchainData, value } = data;
  const localTreasurySpendAmount = onchainData?.isTreasury
    ? onchainData?.treasuryInfo?.amount
    : value;

  if (!isNil(localTreasurySpendAmount)) {
    return (
      <PostItemValueAmount
        amount={localTreasurySpendAmount}
        decimals={decimals}
        symbol={symbol}
        showFaitPrice={showFaitPrice}
      />
    );
  }

  if (onchainData?.allSpends?.length) {
    const { allSpends } = onchainData;
    return (
      <PostListTreasuryAllSpends
        showFaitPrice={showFaitPrice}
        allSpends={allSpends}
      />
    );
  }

  const method = onchainData?.proposal?.method;
  if (method) {
    return <TitleExtra>{method}</TitleExtra>;
  }

  return null;
}
