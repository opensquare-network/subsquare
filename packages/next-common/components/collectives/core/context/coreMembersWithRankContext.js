import { createContext, useContext } from "react";
import useCoreMembersWithRank from "../useCoreMembersWithRank";

const CoreMembersWithRankContext = createContext();

export function CoreMembersWithRankProvider({ children }) {
  const { members: coreMembers, isLoading } = useCoreMembersWithRank();

  return (
    <CoreMembersWithRankContext.Provider value={{ coreMembers, isLoading }}>
      {children}
    </CoreMembersWithRankContext.Provider>
  );
}

export function useCoreMembersWithRankContext() {
  return useContext(CoreMembersWithRankContext);
}
