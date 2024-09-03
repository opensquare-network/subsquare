import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCyclePaidColumn() {
  const { decimals, symbol } = getSalaryAsset();

  return {
    name: "Paid",
    width: 160,
    className: "text-right",
    cellRender(data) {
      return (
        <ValueDisplay
          value={toPrecision(data?.amount, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
