import { createContext, useContext, useMemo } from "react";
import useMyDemotionPeriodExpiration from "../hooks/useMyDemotionPeriodExpiration";
import { useContextMyMemberData } from "./myMemberData";

export const MyDemotionExpirationContext = createContext();

function CheckMyDemotionExpiration({ children, memberData }) {
  const { isDemotionExpiring } = useMyDemotionPeriodExpiration(memberData);
  const data = useMemo(
    () => ({
      isLoading: false,
      isDemotionExpiring,
    }),
    [isDemotionExpiring],
  );
  return (
    <MyDemotionExpirationContext.Provider value={data}>
      {children}
    </MyDemotionExpirationContext.Provider>
  );
}

export default function MyDemotionExpirationProvider({ children }) {
  const { memberData, isLoading: isMemberDataLoading } =
    useContextMyMemberData();

  if (isMemberDataLoading) {
    return (
      <MyDemotionExpirationContext.Provider value={{ isLoading: true }}>
        {children}
      </MyDemotionExpirationContext.Provider>
    );
  }

  if (!memberData?.collectiveMember) {
    return (
      <MyDemotionExpirationContext.Provider
        value={{ isLoading: false, isDemotionExpiring: false }}
      >
        {children}
      </MyDemotionExpirationContext.Provider>
    );
  }

  return (
    <CheckMyDemotionExpiration memberData={memberData}>
      {children}
    </CheckMyDemotionExpiration>
  );
}

export function useContextMyDemotionExpiration() {
  return useContext(MyDemotionExpirationContext);
}
