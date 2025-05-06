import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useCoreFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { normalizeCoreCollectiveEntries } from "next-common/utils/coreCollective/normalize";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { useCallback } from "react";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

export function useFellowshipCoreMembers() {
  const { section } = useCollectivesContext();
  const corePallet = useCoreFellowshipPallet();
  const api = useContextApi();

  const fetchDataFunc = useCallback(
    async (setResult) => {
      if (!api || !api.query[corePallet]?.member) {
        return;
      }

      try {
        const coreEntries = await api.query[corePallet]?.member.entries();

        const data = normalizeCoreCollectiveEntries(coreEntries);

        setResult(data);
      } catch (e) {
        // ignore
      }
    },
    [api, corePallet],
  );

  const {
    result: members,
    fetch,
    loading,
  } = useGlobalCachedFetch(fetchDataFunc, section);

  return { members, fetch, loading };
}
