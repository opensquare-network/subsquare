import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";

export default function getCycleIndexSummaryItem(index) {
  return {
    title: "Cycle Index",
    content: (
      <LoadableContent isLoading={isNil(index)}>{index}</LoadableContent>
    ),
  };
}
