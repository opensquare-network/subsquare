// packages/next-common/hooks/referenda/useMyVotedCollectiveReferenda.js

import { filter, merge } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { normalizeVotingRecord } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

let fetching = false;
const useLoading = createGlobalState(fetching);
const useVotesState = createGlobalState();

export function useMyCollectivesVotes() {
  const api = useContextApi();
  const address = useRealAddress();
  const pallet = useRankedCollectivePallet();
  const [votes, setVotes] = useVotesState();

  const [loading, setLoading] = useLoading();

  const fetch = useCallback(() => {
    if (fetching || !api) {
      return;
    }

    fetching = true;
    setLoading(fetching);

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
      })
      .finally(() => {
        fetching = false;
        setLoading(fetching);
      });
  }, [api, setLoading, pallet, setVotes, address]);

  useEffect(() => {
    if (!votes) {
      fetch();
    }
  }, [fetch, votes]);

  return {
    votes,
    fetch,
    loading,
  };
}
