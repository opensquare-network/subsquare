import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function getCycleRegistrationSummaryItem(
  totalRegistrationsValue,
  decimals,
  symbol,
) {
  return {
    title: "Total Registrations",
    content: (
      <LoadableContent isLoading={isNil(totalRegistrationsValue)}>
        <ValueDisplay
          value={toPrecision(totalRegistrationsValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };
}
