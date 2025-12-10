import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
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

export function useUpdateNominatorUnClaimedRewards() {
  const { fetch } = useNominatorUnClaimedRewardsContext();
  const fetchRef = useRef(fetch);

  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  const update = useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    for (let i = 0; i < 2; i++) {
      await fetchRef.current?.();
      await sleep(blockTime);
    }
  }, []);

  return { update };
}
