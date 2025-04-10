import { useSelector } from "react-redux";
import useSalaryFellowshipPeriods from "./useSalaryFellowshipPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";

export default function useIsSalaryPayoutStarted(status) {
  const { cycleStart } = status || {};
  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const latestHeight = useSelector(chainOrScanHeightSelector);

  return (
    !isNil(latestHeight) && !isNil(payoutStart) && latestHeight >= payoutStart
  );
}
