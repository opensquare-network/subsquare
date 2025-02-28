import { createContext, useContext } from "react";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export const CollectivesMembersContext = createContext({});

export default function CollectivesMembersProvider({ children }) {
  const {
    members,
    loading: isLoading,
    fetch,
  } = useFellowshipCollectiveMembers();

  return (
    <CollectivesMembersContext.Provider
      value={{
        members,
        isLoading,
        fetch,
      }}
    >
      {children}
    </CollectivesMembersContext.Provider>
  );
}

export function useContextCollectivesMembers() {
  return useContext(CollectivesMembersContext);
}
