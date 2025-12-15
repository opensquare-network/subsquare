import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import useNominatorUnClaimedRewards from "../quickActions/useNominatorUnClaimedRewards";
import { sleep } from "next-common/utils";

const NominatorUnClaimedRewardsContext = createContext(null);

export function NominatorUnClaimedRewardsProvider({
  nominatorAddress,
  children,
}) {
  const { result, loading, fetch } =
    useNominatorUnClaimedRewards(nominatorAddress);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <NominatorUnClaimedRewardsContext.Provider
      value={{ result, loading, fetch, isUpdating, setIsUpdating }}
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
  const { fetch, setIsUpdating } = useNominatorUnClaimedRewardsContext();
  const fetchRef = useRef(fetch);
  const setIsUpdatingRef = useRef(setIsUpdating);

  useEffect(() => {
    fetchRef.current = fetch;
    setIsUpdatingRef.current = setIsUpdating;
  }, [fetch, setIsUpdating]);

  const update = useCallback(async () => {
    setIsUpdatingRef.current?.(true);
    try {
      await sleep(100);
      await fetchRef.current?.();
    } finally {
      setIsUpdatingRef.current?.(false);
    }
  }, []);

  return { update };
}
