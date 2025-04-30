import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { useFellowshipCoreMembers } from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function useCoreFellowshipUpdateFunc() {
  const { fetch: fetchCoreMembersWithRank } =
    useFellowshipCoreMembersWithRank();
  const { fetch: fetchCoreMembers } = useFellowshipCoreMembers();
  const { fetch: fetchRankMembers } = useFellowshipCollectiveMembers();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      await fetchCoreMembersWithRank();
      await fetchCoreMembers();
      await fetchRankMembers();
      await sleep(blockTime);
    }
  }, [fetchCoreMembersWithRank, fetchCoreMembers, fetchRankMembers]);
}
