import { useSelector } from "react-redux";
import useFellowshipSalaryPeriods from "./useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";

export function useIsInSalaryRegistrationPeriod(status) {
  const { registrationPeriod } = useFellowshipSalaryPeriods();
  const latestHeight = useSelector(chainOrScanHeightSelector);

  if (isNil(latestHeight) || isNil(status) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = status;
  return cycleStart + registrationPeriod > latestHeight;
}
