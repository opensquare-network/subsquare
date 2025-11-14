import { createContext, useContext, useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { isNil } from "lodash-es";

export const MyPoolContext = createContext(null);

function MyPoolProviderImpl({ children, realAddress }) {
  const { result: poolMemberOpt, loading } = useSubStorage(
    "nominationPools",
    "poolMembers",
    [realAddress],
  );
  const poolMember = useMemo(
    () => poolMemberOpt?.toJSON() || null,
    [poolMemberOpt],
  );

  return (
    <MyPoolContext.Provider
      value={{
        poolMember,
        loading,
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
