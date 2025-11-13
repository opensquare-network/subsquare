import { createContext, useContext, useEffect, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { isNil } from "lodash-es";

export const MyPoolContext = createContext(null);

function MyPoolProviderImpl({ children, realAddress }) {
  const [jsonPoolMember, setJsonPoolMember] = useState(null);
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

  return (
    <MyPoolContext.Provider
      value={{
        poolMember: jsonPoolMember,
        loading: poolMemberLoading,
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
