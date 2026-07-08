import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

export function useFellowshipSalaryCyclePaidColumn() {
  const section = useCollectivesSection();
  return {
    name: "Paid",
    width: 160,
    className: "text-right",
    cellRender(data) {
      const { decimals, symbol } = getSalaryAsset(
        section,
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
