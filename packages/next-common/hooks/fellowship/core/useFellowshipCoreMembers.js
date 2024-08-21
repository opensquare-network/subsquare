import { useContextApi } from "next-common/context/api";
import { useEffect, useCallback } from "react";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { isSameAddress } from "next-common/utils";
import { find } from "lodash-es";
import { createGlobalState } from "react-use";

const useLoading = createGlobalState(false);
const useCachedMembers = createGlobalState(null);

// TODO: refactor fellowship, add pallet or section
export default function useFellowshipCoreMembers() {
  const api = useContextApi();
  const [members, setMembers] = useCachedMembers();
  const [loading, setLoading] = useLoading();

  const fetch = useCallback(async () => {
    if (
      loading ||
      !api ||
      !api.query.fellowshipCore?.member ||
      !api.query.fellowshipCollective?.members
    ) {
      return;
    }

    setLoading(true);

    try {
      const [collectiveEntries, coreEntries] = await Promise.all([
        api.query.fellowshipCollective?.members.entries(),
        api.query.fellowshipCore.member.entries(),
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

      setMembers(data);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (!members) {
      fetch();
    }
  }, [members, fetch]);

  return { members, fetch, loading };
}
