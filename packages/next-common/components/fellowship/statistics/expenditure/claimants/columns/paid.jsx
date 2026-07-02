import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

export function useStatisticsClaimantsPaidColumn() {
  const { symbol } = getSalaryAsset("fellowship");

  return {
    name: "Total Paid",
    width: 160,
    className: "text-right",
    cellRender(data, idx) {
      return <ValueDisplay key={idx} value={data.salary} symbol={symbol} />;
    },
  };
}
