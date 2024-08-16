import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import useSubAmbassadorSalaryStats from "../ambassador/salary/useSubAmbassadorSalaryStats";

export default function useLoadOverviewPageData() {
  useSubFellowshipSalaryStats(); // subscribe fellowship salary status data and save it to redux
  useSubAmbassadorSalaryStats();
}
