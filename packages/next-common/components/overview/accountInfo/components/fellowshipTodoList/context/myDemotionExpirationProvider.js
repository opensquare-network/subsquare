import { createContext, useContext } from "react";
import useMyDemotionPeriodExpiration from "../hooks/useMyDemotionPeriodExpiration";
import { useContextMyMemberData } from "./myMemberDataProvider";

export const MyDemotionExpirationContext = createContext();

function CheckMyDemotionExpiration({ children, memberData }) {
  const { isDemotionExpiring } = useMyDemotionPeriodExpiration(memberData);

  return (
    <MyDemotionExpirationContext.Provider
      value={{
        isLoading: false,
        isDemotionExpiring,
      }}
    >
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

  return (
    <CheckMyDemotionExpiration memberData={memberData}>
      {children}
    </CheckMyDemotionExpiration>
  );
}

export function useContextMyDemotionExpiration() {
  return useContext(MyDemotionExpirationContext);
}
