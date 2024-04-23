import SummaryItem from "next-common/components/summary/layout/item";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";

export default function SalaryStatsIndexItem({ index }) {
  return (
    <SummaryItem title="Cycle Index">
      <LoadableContent isLoading={isNil(index)}>{index}</LoadableContent>
    </SummaryItem>
  );
}
