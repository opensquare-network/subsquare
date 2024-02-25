import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function getCycleBudgetSummaryItem(
  budgetValue,
  decimals,
  symbol,
) {
  return {
    title: "Budget",
    content: (
      <LoadableContent isLoading={isNil(budgetValue)}>
        <ValueDisplay
          value={toPrecision(budgetValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };
}
