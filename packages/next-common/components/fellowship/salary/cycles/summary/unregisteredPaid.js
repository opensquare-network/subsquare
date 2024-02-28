import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function getCycleUnregisteredPaidSummaryItem(
  totalUnregisteredPaidValue,
  decimals,
  symbol,
) {
  return {
    title: "Total Unregistered Paid",
    content: (
      <LoadableContent isLoading={isNil(totalUnregisteredPaidValue)}>
        <ValueDisplay
          value={toPrecision(totalUnregisteredPaidValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };
}
