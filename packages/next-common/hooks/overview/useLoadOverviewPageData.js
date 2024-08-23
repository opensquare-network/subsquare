import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";

export default function useLoadOverviewPageData() {
  useSubFellowshipSalaryStats("ambassadorSalary");
}
