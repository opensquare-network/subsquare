import { useMemo } from "react";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";

export default function useFellowshipSalaryCycleData(
  fellowshipSalaryStats = {},
) {
  const { cycleStart } = fellowshipSalaryStats;

  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const registrationPeriodData = useCalcPeriodBlocks(
    registrationPeriod,
    cycleStart,
  );
  const payoutStart = cycleStart + registrationPeriod || null;
  const payoutPeriodData = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  return useMemo(() => {
    if (
      registrationPeriodData?.gonePercentage > 0 &&
      registrationPeriodData?.gonePercentage < 100
    ) {
      return registrationPeriodData;
    }

    if (
      payoutPeriodData?.gonePercentage > 0 &&
      payoutPeriodData?.gonePercentage < 100
    ) {
      return payoutPeriodData;
    }

    return null;
  }, [registrationPeriodData, payoutPeriodData]);
}
