import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function getCyclePotSummaryItem(potValue, decimals, symbol) {
  return {
    title: "Pot",
    content: (
      <LoadableContent isLoading={isNil(potValue)}>
        <ValueDisplay value={toPrecision(potValue, decimals)} symbol={symbol} />
      </LoadableContent>
    ),
  };
}
