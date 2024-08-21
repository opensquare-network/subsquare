import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";

export default function useLoadOverviewPageData() {
  useSubFellowshipSalaryStats(); // subscribe fellowship salary status data and save it to redux
  useSubFellowshipSalaryStats("ambassadorSalary");
}
