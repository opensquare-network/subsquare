import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function getCycleUnregisteredPaidSummaryItem(
  totalUnregisteredPaidValue,
  decimals,
  symbol,
  memberCount,
) {
  return {
    title: "Total Unregistered Paid",
    content: (
      <LoadableContent isLoading={isNil(totalUnregisteredPaidValue)}>
        <ValueDisplay
          value={toPrecision(totalUnregisteredPaidValue, decimals)}
          symbol={symbol}
        />
        {!isNil(memberCount) && (
          <div className="text12Medium text-textSecondary !ml-0">
            {memberCount} Members
          </div>
        )}
      </LoadableContent>
    ),
  };
}
