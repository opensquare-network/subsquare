import { createContext, useContext } from "react";
import useSubMyCoreMember from "next-common/hooks/ambassador/core/useSubMyCoreMember";
import useMyAmbassadorSalaryClaimant from "next-common/hooks/ambassador/salary/useMyAmbassadorClaimant";

const MyAmbassadorSalaryClaimantContext = createContext(null);

export function MyAmbassadorSalaryClaimantProvider({ children }) {
  const { claimant, isLoading: isLoadingClaimant } =
    useMyAmbassadorSalaryClaimant();
  const { member, isLoading: isLoadingMember } = useSubMyCoreMember();

  return (
    <MyAmbassadorSalaryClaimantContext.Provider
      value={{
        claimant,
        member,
        isLoading: isLoadingClaimant || isLoadingMember,
      }}
    >
      {children}
    </MyAmbassadorSalaryClaimantContext.Provider>
  );
}

export function useMyAmbassadorSalaryClaimantFromContext() {
  return useContext(MyAmbassadorSalaryClaimantContext);
}
