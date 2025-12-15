import { createContext, useContext, useCallback } from "react";
import useNominatorUnClaimedRewards from "../quickActions/useNominatorUnClaimedRewards";

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

export function useUpdateNominatorUnClaimedRewards() {
  const { fetch } = useNominatorUnClaimedRewardsContext();

  const update = useCallback(async () => {
    await fetch();
  }, [fetch]);

  return { update };
}
