import { find } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useCallback } from "react";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

export default function useFellowshipCoreMembers() {
  const api = useContextApi();
  const { section } = useCollectivesContext();
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const fetchDataFunc = useCallback(
    async (setResult) => {
      if (
        !api ||
        !api.query[corePallet]?.member ||
        !api.query[collectivePallet]?.members
      ) {
        return;
      }

      try {
        const [collectiveEntries, coreEntries] = await Promise.all([
          api.query[collectivePallet]?.members.entries(),
          api.query[corePallet].member.entries(),
        ]);

        const collectiveMembers =
          normalizeRankedCollectiveEntries(collectiveEntries);

        const data = coreEntries.map(([storageKey, memberStatus]) => {
          const address = storageKey.args[0].toString();
          const rank = find(collectiveMembers, (m) =>
            isSameAddress(m.address, address),
          )?.rank;

          return {
            address,
            rank,
            status: memberStatus.toJSON(),
          };
        });

        setResult(data);
      } catch (e) {
        setResult();
      }
    },
    [api, corePallet, collectivePallet],
  );

  const {
    result: members,
    fetch,
    loading,
  } = useGlobalCachedFetch(fetchDataFunc, section);

  return { members, fetch, loading };
}
