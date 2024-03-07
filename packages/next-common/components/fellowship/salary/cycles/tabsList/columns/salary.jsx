import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCycleSalaryColumn() {
  const { decimals, symbol } = useSalaryAsset();

  return {
    name: "Salary",
    width: 160,
    cellRender(data) {
      return (
        <ValueDisplay
          value={toPrecision(data.salary, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
