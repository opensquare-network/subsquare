import { createContext, useContext } from "react";
import useMemberData from "../../../hook/useMemberData";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

const MyMemberDataContext = createContext();

export default function MyMemberDataProvider({ children }) {
  const section = useCollectivesSection();
  const { data: memberData, isLoading } = useMemberData(section);

  return (
    <MyMemberDataContext.Provider value={{ memberData, isLoading }}>
      {children}
    </MyMemberDataContext.Provider>
  );
}

export function useContextMyMemberData() {
  return useContext(MyMemberDataContext);
}

export function useContextIsLoadingMyMemberData() {
  const { isLoading } = useContextMyMemberData();
  return isLoading;
}

export function useContextMyRank() {
  const { memberData } = useContextMyMemberData();
  return memberData?.collectiveMember?.rank;
}
