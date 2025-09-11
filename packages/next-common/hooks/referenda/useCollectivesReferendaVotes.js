import { useEffect, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

export default function useCollectivesReferendaVotes() {
  const api = useContextApi();
  const address = useRealAddress();
  const [votes, setVotes] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const pallet = useRankedCollectivePallet();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query[pallet].voting.entries().then((data) => {
      const result = data.map((item) => {
        const [
          {
            args: [referendumIndex, voterAddress],
          },
          vote,
        ] = item;
        return {
          referendumIndex: referendumIndex.toNumber(),
          voter: voterAddress.toJSON(),
          vote: vote.toJSON(),
        };
      });

      setVotes(result);
      setIsLoading(false);
    });
  }, [api, pallet, address]);

  return { votes, isLoading };
}
