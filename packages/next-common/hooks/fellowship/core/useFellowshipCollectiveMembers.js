import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useCallback, useMemo } from "react";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

export function useFellowshipCollectiveMembers() {
  const { section } = useCollectivesContext();

  const { fellowshipMembers, ambassadorMembers } = usePageProps();
  let membersFromServer;
  if (section === "fellowship") {
    membersFromServer = fellowshipMembers;
  } else if (section === "ambassador") {
    membersFromServer = ambassadorMembers;
  }

  const collectivePallet = useRankedCollectivePallet();
  const api = useContextApi();

  const fetchDataFunc = useCallback(
    async (setResult) => {
      if (!api || !api.query[collectivePallet]?.members) {
        return;
      }

      try {
        const collectiveEntries = await api.query[
          collectivePallet
        ].members.entries();

        const data = normalizeRankedCollectiveEntries(collectiveEntries);

        setResult(data);
      } catch (e) {
        // ignore
      }
    },
    [api, collectivePallet],
  );

  const {
    result: members,
    fetch,
    loading,
  } = useGlobalCachedFetch(fetchDataFunc, section);

  return {
    members: members || membersFromServer,
    fetch,
    loading: !membersFromServer && loading,
  };
}

export function useSortedFellowshipCollectiveMembers() {
  const { members, fetch, loading } = useFellowshipCollectiveMembers();

  const sortedMembers = useMemo(() => {
    if (!members) {
      return null;
    }
    const membersToSort = [...members];
    membersToSort.sort((a, b) => {
      if (a.rank !== b.rank) {
        return b.rank - a.rank;
      }
      if (a.address < b.address) {
        return -1;
      }
      if (a.address > b.address) {
        return 1;
      }
      return 0;
    });
    return membersToSort;
  }, [members]);

  return {
    members: sortedMembers,
    fetch,
    loading,
  };
}
