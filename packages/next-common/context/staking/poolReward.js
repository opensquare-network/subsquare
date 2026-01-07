import { useRewardClaimable } from "next-common/hooks/staking/useRewardClaimable";
import { createContext, useContext } from "react";

const MyPoolRewardContext = createContext(null);

export default MyPoolRewardContext;

export function MyPoolRewardProvider({ children }) {
  const { claimable, loading } = useRewardClaimable();
  return (
    <MyPoolRewardContext.Provider value={{ claimable, loading }}>
      {children}
    </MyPoolRewardContext.Provider>
  );
}

export function useMyPoolRewardContext() {
  return useContext(MyPoolRewardContext) || {};
}
