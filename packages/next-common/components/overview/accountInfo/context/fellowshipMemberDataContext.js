import CollectivesProvider from "next-common/context/collectives/collectives";
import { createContext, useContext } from "react";
import useMemberData from "../hook/useMemberData";

const FellowshipMemberDataContext = createContext();

function MemberDataProvider({ children }) {
  const { data, isLoading } = useMemberData();
  return (
    <FellowshipMemberDataContext.Provider value={{ data, isLoading }}>
      {children}
    </FellowshipMemberDataContext.Provider>
  );
}

export default function FellowshipMemberDataProvider({ children }) {
  return (
    <CollectivesProvider section="fellowship">
      <MemberDataProvider>{children}</MemberDataProvider>
    </CollectivesProvider>
  );
}

export function useFellowshipMemberData() {
  return useContext(FellowshipMemberDataContext);
}
