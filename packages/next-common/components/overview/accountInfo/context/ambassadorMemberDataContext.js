import CollectivesProvider from "next-common/context/collectives/collectives";
import { createContext, useContext } from "react";
import useMemberData from "../hook/useMemberData";

const AmbassadorMemberDataContext = createContext();

function MemberDataProvider({ children }) {
  const { data, isLoading } = useMemberData();
  return (
    <AmbassadorMemberDataContext.Provider value={{ data, isLoading }}>
      {children}
    </AmbassadorMemberDataContext.Provider>
  );
}

export default function AmbassadorMemberDataProvider({ children }) {
  return (
    <CollectivesProvider section="ambassador">
      <MemberDataProvider>{children}</MemberDataProvider>
    </CollectivesProvider>
  );
}

export function useAmbassadorMemberData() {
  return useContext(AmbassadorMemberDataContext);
}
