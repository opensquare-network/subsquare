import { createContext, useCallback, useContext, useState } from "react";
import { noop } from "lodash-es";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import useNow from "next-common/hooks/useNow";

const DEFAULT_IS_TIME = false;

const RegionTimeContext = createContext({
  isTime: DEFAULT_IS_TIME,
  isLoading: true,
  latestHeight: null,
  now: 0,
  relayChainBlockTime: null,
  toggleIsTime: noop,
});

export function useRegionTimeContext() {
  return useContext(RegionTimeContext);
}

export function RegionTimeProvider({ children }) {
  const [isTime, setIsTime] = useState(DEFAULT_IS_TIME);
  const [initialNow] = useState(Date.now);
  const relayChainBlockTime = useRelayChainBlockTime();
  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();
  const now = useNow() || initialNow;

  const toggleIsTime = useCallback(() => {
    setIsTime((previousIsTime) => !previousIsTime);
  }, []);

  return (
    <RegionTimeContext.Provider
      value={{
        isTime,
        isLoading,
        latestHeight,
        now,
        relayChainBlockTime,
        toggleIsTime,
      }}
    >
      {children}
    </RegionTimeContext.Provider>
  );
}
