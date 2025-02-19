import { createContext, useContext } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export const MembersContext = createContext({});

export default function MembersProvider({ children }) {
  const { members, loading: isLoading } = useFellowshipCoreMembers();

  return (
    <MembersContext.Provider
      value={{
        members,
        isLoading,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export function useContextMembers() {
  return useContext(MembersContext);
}
