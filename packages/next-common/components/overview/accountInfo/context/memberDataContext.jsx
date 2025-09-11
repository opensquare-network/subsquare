// TODO: refactor fellowship and ambassador `next-common/context/collectives/member.js`

import CollectivesProvider from "next-common/context/collectives/collectives";
import { createContext, useContext } from "react";

const Context = createContext();

export default function MemberDataProvider({
  fellowshipMemberData,
  ambassadorMemberData,
  children,
}) {
  let section;

  if (fellowshipMemberData.data) {
    section = "fellowship";
  } else if (ambassadorMemberData.data) {
    section = "ambassador";
  }

  return (
    <Context.Provider
      value={{
        fellowshipMemberData,
        ambassadorMemberData,
      }}
    >
      <CollectivesProvider section={section}>{children}</CollectivesProvider>
    </Context.Provider>
  );
}

export function useFellowshipMemberData() {
  const { fellowshipMemberData } = useContext(Context);
  return fellowshipMemberData;
}

export function useAmbassadorMemberData() {
  const { ambassadorMemberData } = useContext(Context);
  return ambassadorMemberData;
}
