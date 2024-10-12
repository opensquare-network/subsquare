import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { isNil } from "lodash-es";

export function useIsInSalaryPayoutPeriod(status) {
  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useBlockHeight();

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  const payoutStart = cycleStart + registrationPeriod || null;

  return payoutStart + payoutPeriod > latestHeight;
}
