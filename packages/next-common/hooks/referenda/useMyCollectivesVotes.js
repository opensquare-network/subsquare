// packages/next-common/hooks/referenda/useMyVotedCollectiveReferenda.js

import { filter, merge } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { normalizeVotingRecord } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
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

            return merge(
              {
                referendumIndex: storageKey.args[0].toNumber(),
                address: storageKey.args[1].toString(),
              },
              normalizeVotingRecord(optional),
            );
          });
      })
      .then((normalized) => {
        setVotes(filter(normalized, { address }));
      });
  }, [api, pallet, address, setVotes]);

  return votes;
}
