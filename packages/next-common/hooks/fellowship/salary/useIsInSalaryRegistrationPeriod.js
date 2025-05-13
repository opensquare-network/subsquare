import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";

export function useIsInSalaryRegistrationPeriod(status) {
  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useChainOrScanHeight();

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  return cycleStart + registrationPeriod > latestHeight;
}

export function useIsSalaryPayoutPeriod(status) {
  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useChainOrScanHeight();

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  return cycleStart + registrationPeriod <= latestHeight;
}
