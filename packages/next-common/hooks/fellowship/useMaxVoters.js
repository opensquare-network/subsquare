import { useOnchainData } from "../../context/post";
import { useTrack } from "next-common/context/post/gov2/track";
import useReferendumVotingFinishHeight, {
  useReferendumVotingFinishIndexer
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useMemo } from "react";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import useCall from "next-common/utils/hooks/useCall";

function useQueryMaxVoters() {
  const { id: trackId } = useTrack();
  const indexer = useReferendumVotingFinishIndexer();
  const pallet = useRankedCollectivePallet();

  const rank = useMemo(() => {
    return getMinRankOfClass(trackId, pallet);
  }, [trackId, pallet]);

  const blockApi = useBlockApi(indexer?.blockHash);
  const { value } = useCall(
    blockApi?.query?.[pallet].memberCount,
    [rank],
    { cacheKey: `${pallet}-memberCount` },
  );

  return value?.toString();
}

export default function useMaxVoters() {
  const onchain = useOnchainData();
  const scanTally = onchain.tally || onchain?.info?.tally; // tally from scan
  const maybeOnChain = useQueryMaxVoters();

  return maybeOnChain || scanTally.electorate || 0;
}
