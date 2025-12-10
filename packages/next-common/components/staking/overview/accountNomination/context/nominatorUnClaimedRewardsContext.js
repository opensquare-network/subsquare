import { createContext, useContext, useCallback } from "react";
import useNominatorUnClaimedRewards from "../quickActions/useNominatorUnClaimedRewards";
import { sleep } from "next-common/utils";
import { defaultBlockTime } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

const NominatorUnClaimedRewardsContext = createContext(null);

export function NominatorUnClaimedRewardsProvider({
  nominatorAddress,
  children,
}) {
  const { result, loading, fetch } =
    useNominatorUnClaimedRewards(nominatorAddress);

  return (
    <NominatorUnClaimedRewardsContext.Provider
      value={{ result, loading, fetch }}
    >
      {children}
    </NominatorUnClaimedRewardsContext.Provider>
  );
}

export function useNominatorUnClaimedRewardsContext() {
  const context = useContext(NominatorUnClaimedRewardsContext);
  return context;
}

export function useFetchNominatorUnClaimedRewards2Times() {
  const { fetch } = useNominatorUnClaimedRewardsContext() || {};

  return useCallback(async () => {
    if (!fetch) return;

    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    for (let i = 0; i < 2; i++) {
      await fetch();
      await sleep(blockTime);
    }
  }, [fetch]);
}
