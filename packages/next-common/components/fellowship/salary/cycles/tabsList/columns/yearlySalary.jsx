import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCycleYearlySalaryColumn() {
  return {
    name: "Salary",
    width: 160,
    cellRender(data) {
      const { decimals, symbol } = getSalaryAsset(
        "fellowship",
        data?.paidIndexer?.blockHeight,
      );
      return (
        <ValueDisplay
          value={toPrecision(data.salary, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
