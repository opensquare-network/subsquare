import SalaryTotalWithTooltip from "next-common/components/collectives/salaryTotalWithTooltip";

export function useStatisticsClaimantsPaidColumn() {
  return {
    name: "Total Paid",
    width: 240,
    className: "text-right",
    cellRender(data, idx) {
      return <SalaryTotalWithTooltip key={idx} salary={data.salary} />;
    },
  };
}
