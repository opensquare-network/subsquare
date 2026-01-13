import React from "react";
import PostVotesSummary from "../common/votesSummary";

export default function PostItemVotesSummary({ data }) {
  const tally = data?.onchainData?.tally ?? data?.onchainData?.info?.tally;

  if (!tally) {
    return null;
  }
  return <PostVotesSummary tally={tally} />;
}
