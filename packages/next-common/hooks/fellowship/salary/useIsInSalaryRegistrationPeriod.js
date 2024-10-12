import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { isNil } from "lodash-es";

export function useIsInSalaryRegistrationPeriod(status) {
  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useBlockHeight();

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  return cycleStart + registrationPeriod > latestHeight;
}
