import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export function useProfileFellowshipSalaryPaymentPaidColumn() {
  const { decimals, symbol } = useSalaryAsset();

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
