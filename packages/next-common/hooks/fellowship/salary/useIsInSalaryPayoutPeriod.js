import { useSelector } from "react-redux";
import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";

export function useIsInSalaryPayoutPeriod(status) {
  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const latestHeight = useSelector(chainOrScanHeightSelector);

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  const payoutStart = cycleStart + registrationPeriod || null;

  return payoutStart + payoutPeriod > latestHeight;
}
