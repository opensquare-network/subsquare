import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

export function useFellowshipSalaryCycleYearlySalaryColumn() {
  const section = useCollectivesSection();
  return {
    name: "Salary",
    width: 160,
    cellRender(data) {
      const { decimals, symbol } = getSalaryAsset(
        section,
        data?.paidIndexer?.blockHeight ?? data?.indexer?.blockHeight,
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
