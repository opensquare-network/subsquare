import { createContext, useContext, useMemo } from "react";
import useRegistrationAndPayoutCommonInfo from "next-common/hooks/fellowship/useRegistrationAndPayoutCommonInfo";
import useMySalary from "next-common/hooks/fellowship/useMySalary";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";
import useIsSalaryPayoutStarted from "next-common/hooks/fellowship/salary/useIsSalaryPayoutStarted";
const RegistrationAndPayoutActionsContext = createContext({
  registrationJudgementInfo: {},
  payoutJudgementInfo: {},
});

export default function RegistrationAndPayoutActionsProvider({ children }) {
  const { address, claimant, isLoading, status } =
    useRegistrationAndPayoutCommonInfo();

  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const mySalary = useMySalary();
  const onInBlock = useClaimantsFellowshipUpdateFunc();

  const registrationJudgementInfo = useMemo(
    () => ({
      address,
      claimant,
      status,
      isRegistrationPeriod,
      mySalary,
      onInBlock,
    }),
    [address, claimant, isRegistrationPeriod, mySalary, onInBlock, status],
  );

  const isStarted = useIsSalaryPayoutStarted(status);
  const { cycleIndex } = status || {};

  const payoutJudgementInfo = useMemo(
    () => ({
      address,
      claimant,
      isLoading,
      isStarted,
      cycleIndex,
    }),
    [address, claimant, cycleIndex, isLoading, isStarted],
  );

  return (
    <RegistrationAndPayoutActionsContext.Provider
      value={{ registrationJudgementInfo, payoutJudgementInfo }}
    >
      {children}
    </RegistrationAndPayoutActionsContext.Provider>
  );
}

export function useRegistrationAndPayoutJudgementInfoFromContext() {
  return useContext(RegistrationAndPayoutActionsContext);
}
