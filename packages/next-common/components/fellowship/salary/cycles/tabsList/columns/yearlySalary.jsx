import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCycleYearlySalaryColumn() {
  const { decimals, symbol } = getSalaryAsset();

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
