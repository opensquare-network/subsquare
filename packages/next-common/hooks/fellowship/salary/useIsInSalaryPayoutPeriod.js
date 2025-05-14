import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";

export function useIsInSalaryPayoutPeriod(status) {
  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useChainOrScanHeight();

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  const payoutStart = cycleStart + registrationPeriod || null;

  return payoutStart + payoutPeriod > latestHeight;
}
