import { set } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

let fetching = false;

const useLoading = createGlobalState(fetching);
const useCachedMembers = createGlobalState({});

export function useFellowshipCollectiveMembers() {
  const { fellowshipMembers } = usePageProps();

  const [loading, setLoading] = useLoading();
  const { section } = useCollectivesContext();
  const collectivePallet = useRankedCollectivePallet();
  const api = useContextApi();
  const [cachedMembers, setCachedMembers] = useCachedMembers();

  const members = cachedMembers?.[section];

  const fetch = useCallback(async () => {
    if (fetching || !api || !api.query[collectivePallet]?.members) {
      return;
    }

    fetching = true;
    setLoading(fetching);

    try {
      const collectiveEntries = await api.query[
        collectivePallet
      ].members.entries();

      const data = normalizeRankedCollectiveEntries(collectiveEntries);

      setCachedMembers((val) => {
        set(val, section, data);
        return val;
      });
    } finally {
      fetching = false;
      setLoading(fetching);
    }
  }, [api, collectivePallet, section]);

  useEffect(() => {
    if (!members) {
      fetch();
    }
  }, [members, fetch]);

  return { members: members || fellowshipMembers, fetch, loading };
}
