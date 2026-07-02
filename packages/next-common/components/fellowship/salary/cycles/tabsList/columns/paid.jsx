import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCyclePaidColumn() {
  return {
    name: "Paid",
    width: 160,
    className: "text-right",
    cellRender(data) {
      const { decimals, symbol } = getSalaryAsset(
        "fellowship",
        data?.paidIndexer?.blockHeight,
      );
      return (
        <ValueDisplay
          value={toPrecision(data?.amount, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
