import SalaryAssetValues from "next-common/components/collectives/salaryAssetValues";

export function useStatisticsClaimantsPaidColumn() {
  return {
    name: "Total Paid",
    width: 240,
    className: "text-right",
    cellRender(data, idx) {
      return <SalaryAssetValues key={idx} salary={data.salary} />;
    },
  };
}
