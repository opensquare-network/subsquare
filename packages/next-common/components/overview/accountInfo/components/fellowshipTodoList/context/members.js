import { createContext, useContext } from "react";
import { useEligibleFellowshipCoreMembers } from "next-common/components/fellowship/core/memberWarnings";

export const MembersContext = createContext({});

export default function MembersProvider({ children }) {
  // todo: update members data after dump action
  const { members, loading: isLoading } = useEligibleFellowshipCoreMembers();

  return (
    <MembersContext.Provider
      value={{
        members: (members || []).sort((a, b) => b.rank - a.rank),
        isLoading,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export function useContextMembers() {
  const data = useContext(MembersContext);
  return data?.members;
}
