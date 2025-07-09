import React from "react";
import PostVotesSummary from "./votesSummary";
import { useChainSettings } from "next-common/context/chain";

export default function PostItemVotesSummaryImpl({ data }) {
  const tally = data?.onchainData?.tally ?? data?.onchainData?.info?.tally;
  const chainSettings = useChainSettings(data.indexer?.blockHeight);
  const symbol = chainSettings.symbol;

  if (!tally) {
    return null;
  }
  return (
    <PostVotesSummary
      decimals={chainSettings.decimals}
      tally={tally}
      symbol={symbol}
    />
  );
}
