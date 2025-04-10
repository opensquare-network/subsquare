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
  const { address, memberAddrs, claimant, isLoading, status } =
    useRegistrationAndPayoutCommonInfo();

  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const mySalary = useMySalary();
  const onInBlock = useClaimantsFellowshipUpdateFunc();

  const registrationJudgementInfo = useMemo(
    () => ({
      address,
      memberAddrs,
      claimant,
      status,
      isRegistrationPeriod,
      mySalary,
      onInBlock,
    }),
    [
      address,
      claimant,
      isRegistrationPeriod,
      memberAddrs,
      mySalary,
      onInBlock,
      status,
    ],
  );

  const isStarted = useIsSalaryPayoutStarted(status);
  const isCollectiveMember = memberAddrs.includes(address);
  const { cycleIndex } = status || {};

  const payoutJudgementInfo = useMemo(
    () => ({
      address,
      memberAddrs,
      claimant,
      isLoading,
      isStarted,
      isCollectiveMember,
      cycleIndex,
    }),
    [
      address,
      claimant,
      cycleIndex,
      isCollectiveMember,
      isLoading,
      isStarted,
      memberAddrs,
    ],
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
