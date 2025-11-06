import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

export const MyPoolContext = createContext(null);

function MyPoolProviderImpl({ children, realAddress }) {
  const [rewardLoading, setRewardLoading] = useState(false);
  const [claimable, setClaimable] = useState(null);
  const [jsonPoolMember, setJsonPoolMember] = useState(null);
  const api = useContextApi();
  const { result: poolMember, loading: poolMemberLoading } = useSubStorage(
    "nominationPools",
    "poolMembers",
    [realAddress],
  );

  useEffect(() => {
    if (poolMember && !poolMember.isNone) {
      setJsonPoolMember(poolMember?.toJSON() || null);
    }
  }, [poolMember]);

  const getRewardResult = useCallback(async () => {
    setRewardLoading(true);
    api?.call?.nominationPoolsApi
      ?.pendingRewards(realAddress)
      .then((pendingRewards) => {
        const claimable = BigNumber(pendingRewards);
        setClaimable(claimable);
      })
      .finally(() => setRewardLoading(false));
  }, [api, realAddress]);

  useEffect(() => {
    if (!api || !(poolMember && !poolMember.isNone)) {
      return;
    }

    getRewardResult();
  }, [api, poolMember, getRewardResult]);

  return (
    <MyPoolContext.Provider
      value={{
        claimable,
        poolMember: jsonPoolMember,
        loading: poolMemberLoading || rewardLoading,
      }}
    >
      {children}
    </MyPoolContext.Provider>
  );
}
export function MyPoolProvider({ children }) {
  const realAddress = useRealAddress();
  if (isNil(realAddress)) {
    return children;
  }
  return (
    <MyPoolProviderImpl realAddress={realAddress}>
      {children}
    </MyPoolProviderImpl>
  );
}

export function useMyPool() {
  return useContext(MyPoolContext) || {};
}
