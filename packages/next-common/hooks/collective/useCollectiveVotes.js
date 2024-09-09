import { useCollectivePallet } from "next-common/context/collective";
import { useOnchainData } from "next-common/context/post";
import { isMotionEnded } from "next-common/utils";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useMemo } from "react";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export function useVotesFromDb() {
  const onchainData = useOnchainData();
  const chain = useChain();

  return useMemo(() => {
    const singleApprovalMotion = onchainData.threshold === 1;
    if (singleApprovalMotion) {
      return [[onchainData.authors[0], true]];
    }

    const timeline = onchainData.timeline || [];
    const rawVoters = timeline
      .filter((item) => item.method === "Voted")
      .map((item) => [item.args.voter, item.args.approve]);

    // special data, in kusama before motion 345, proposer has a default aye vote
    if (
      (Chains.kusama === chain && onchainData.index < 345) ||
      (Chains.polkadot === chain && onchainData.index <= 107)
    ) {
      const proposed = timeline.find((item) => item.method === "Proposed");
      rawVoters.unshift([proposed.args.proposer, true]);
    }
    return Array.from(new Map(rawVoters));
  }, [onchainData, chain]);
}

export function useCollectiveMotionOnChainVotes() {
  const pallet = useCollectivePallet();
  const onchainData = useOnchainData();
  const { hash } = onchainData;

  const motionEnd = isMotionEnded(onchainData);
  const blockHash = motionEnd ? onchainData?.state?.indexer?.blockHash : null;
  const api = useBlockApi(blockHash);

  const { loading, result } = useSubStorage(pallet, "voting", [hash], { api });

  return {
    loading,
    data: result?.toJSON(),
  };
}

export default function useCollectiveMotionVotes() {
  const onchain = useCollectiveMotionOnChainVotes();
  const dbVotes = useVotesFromDb();
  const { ayes = [], nays = [] } = onchain?.data || {};

  return useMemo(() => {
    const votes = [...dbVotes];
    for (const voter of ayes) {
      const vote = votes.find((item) => item[0] === voter);
      if (!vote) {
        votes.push([voter, true]);
      } else {
        vote[1] = true;
      }
    }

    for (const voter of nays) {
      const vote = votes.find((item) => item[0] === voter);
      if (!vote) {
        votes.push([voter, false]);
      } else {
        vote[1] = false;
      }
    }

    return votes;
  }, [dbVotes, ayes, nays]);
}
