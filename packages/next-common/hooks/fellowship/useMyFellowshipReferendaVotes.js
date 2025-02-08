import { zip } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";

export default function useMyFellowshipReferendaVotes(referendumIndexes = []) {
  const api = useContextApi();
  const address = useRealAddress();
  const collectivePallet = useRankedCollectivePallet();
  const [referendaVotes, setReferendaVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !collectivePallet) {
      return;
    }

    const keys = referendumIndexes.map((referendumIndex) => [
      referendumIndex,
      address,
    ]);
    api.query[collectivePallet].voting.multi(keys).then((votes) => {
      const myReferendaVotes = zip(referendumIndexes, votes)
        .filter(([, vote]) => vote.isSome)
        .map(([i, vote]) => ({ referendumIndex: i, vote: vote.unwrap() }));
      setReferendaVotes(myReferendaVotes);
      setIsLoading(false);
    });
  }, [api, collectivePallet, address, referendumIndexes]);

  return {
    referendaVotes,
    isLoading,
  };
}
