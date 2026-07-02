import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useProfileFellowshipSalaryPaymentPaidColumn(props = {}) {
  return {
    name: "Paid",
    width: 160,
    className: "text-right",
    cellRender(data, idx) {
      const { decimals, symbol } = getSalaryAsset(
        "fellowship",
        data?.paidIndexer?.blockHeight,
      );
      return (
        <ValueDisplay
          key={idx}
          value={toPrecision(data.salary, decimals)}
          symbol={symbol}
        />
      );
    },
    ...props,
  };
}
