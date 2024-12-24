// packages/next-common/hooks/referenda/useMyVotedCollectiveReferenda.js

import { filter } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { createGlobalState } from "react-use";

const useVotesState = createGlobalState();

export function useMyCollectivesVotes() {
  const api = useContextApi();
  const address = useRealAddress();
  const pallet = useRankedCollectivePallet();
  const [votes, setVotes] = useVotesState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query[pallet].voting
      .entries()
      .then((entries) => {
        return entries
          .filter((votingOf) => votingOf?.[1]?.isSome)
          .map((votingOf) => {
            const [storageKey, optional] = votingOf;
            const voting = optional?.unwrap();
            const aye = voting?.isAye;
            const votes = aye
              ? voting.asAye.toNumber()
              : voting.asNay.toNumber();

            return {
              referendumIndex: storageKey.args[0].toNumber(),
              address: storageKey.args[1].toString(),
              aye,
              votes,
            };
          });
      })
      .then((normalized) => {
        return filter(normalized, { address });
      })
      .then(setVotes);

    return () => {
      setVotes(null);
    };
  }, [api, pallet, address, setVotes]);

  return votes;
}
