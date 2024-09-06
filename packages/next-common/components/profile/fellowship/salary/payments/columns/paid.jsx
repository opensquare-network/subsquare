import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useProfileFellowshipSalaryPaymentPaidColumn() {
  const { decimals, symbol } = getSalaryAsset();

  return {
    name: "Paid",
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
