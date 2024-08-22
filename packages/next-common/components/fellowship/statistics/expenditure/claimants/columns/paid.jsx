import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useStatisticsClaimantsPaidColumn() {
  const { decimals, symbol } = useSalaryAsset();

  return {
    name: "Total Paid",
    width: 160,
    className: "text-right",
    cellRender(data, idx) {
      return (
        <ValueDisplay
          key={idx}
          value={toPrecision(data.salary, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}