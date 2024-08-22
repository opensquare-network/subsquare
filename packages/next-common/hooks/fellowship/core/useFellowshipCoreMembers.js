import { find, set } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

// A flag to ensure only one fetch operation runs at a time.
let fetching = false;

const useLoading = createGlobalState(fetching);
const useCachedMembers = createGlobalState({});

export default function useFellowshipCoreMembers() {
  const { section } = useCollectivesContext();
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const api = useContextApi();
  const [cachedMembers, setCachedMembers] = useCachedMembers();
  const [loading, setLoading] = useLoading();

  const members = cachedMembers?.[section];

  const fetch = useCallback(async () => {
    if (
      fetching ||
      !api ||
      !api.query[corePallet]?.member ||
      !api.query[collectivePallet]?.members
    ) {
      return;
    }

    fetching = true;
    setLoading(fetching);

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

      setCachedMembers((val) => {
        set(val, section, data);
        return val;
      });
    } finally {
      fetching = false;
      setLoading(fetching);
    }
  }, [api, corePallet, collectivePallet, section]);

  useEffect(() => {
    if (!members) {
      fetch();
    }
  }, [members, fetch]);

  return { members, fetch, loading };
}
