import { useOnchainData } from "../../context/post";
import { useTrack } from "next-common/context/post/gov2/track";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useMemo } from "react";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import useCall from "next-common/utils/hooks/useCall";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function useQueryMaxVoters() {
  const { id: trackId } = useTrack();
  const pallet = useRankedCollectivePallet();

  const rank = useMemo(() => {
    return getMinRankOfClass(trackId, pallet);
  }, [trackId, pallet]);

  const blockApi = useConditionalContextApi();
  const { value } = useCall(blockApi?.query?.[pallet].memberCount, [rank], {
    cacheKey: `${pallet}-memberCount`,
  });

  return value?.toString();
}

export default function useMaxVoters() {
  const onchain = useOnchainData();
  const scanTally = onchain.tally || onchain?.info?.tally; // tally from scan
  const maybeOnChain = useQueryMaxVoters();

  return maybeOnChain || scanTally.electorate || 0;
}
