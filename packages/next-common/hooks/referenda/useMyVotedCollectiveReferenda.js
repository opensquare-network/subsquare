import { useEffect, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";

export default function useMyVotedCollectiveReferenda() {
  const api = useContextApi();
  const address = useRealAddress();
  const [myVotedReferenda, setMyVotedReferenda] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const pallet = useRankedCollectivePallet();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query[pallet].voting.entries().then((data) => {
      const result = data
        .map((item) => {
          const [
            {
              args: [referendumIndex, voterAddress],
            },
          ] = item;
          const isMyVote = isSameAddress(voterAddress.toJSON(), address);
          return [referendumIndex.toNumber(), isMyVote];
        })
        .filter(([, isMyVote]) => isMyVote)
        .map(([referendumIndex]) => referendumIndex);

      setMyVotedReferenda(result);
      setIsLoading(false);
    });
  }, [api, pallet, address]);

  return { myVotedReferenda, isLoading };
}
