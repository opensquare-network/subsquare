import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCycleYearlySalaryColumn() {
  const { decimals, symbol } = useSalaryAsset();

  return {
    name: "Yearly Salary",
    width: 160,
    className: "text-right",
    cellRender(data) {
      return (
        <ValueDisplay
          // FIXME: cycle, yearly salary
          value={toPrecision(data.salary, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
