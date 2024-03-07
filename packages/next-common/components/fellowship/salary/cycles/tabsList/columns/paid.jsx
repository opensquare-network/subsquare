import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useFellowshipSalaryCyclePaidColumn() {
  const { decimals, symbol } = useSalaryAsset();

  return {
    name: "Paid",
    width: 160,
    className: "text-right",
    cellRender(data) {
      return (
        <ValueDisplay
          // FIXME: cycle, value
          value={toPrecision(data.paid, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
