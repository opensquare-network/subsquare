import { createContext, useContext } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export const CoreMembersContext = createContext({});

export default function CoreMembersProvider({ children }) {
  const { members, loading: isLoading } = useFellowshipCoreMembers();

  return (
    <CoreMembersContext.Provider
      value={{
        members,
        isLoading,
      }}
    >
      {children}
    </CoreMembersContext.Provider>
  );
}

export function useContextCoreMembers() {
  return useContext(CoreMembersContext);
}
