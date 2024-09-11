import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";

export default function TotalTreasury() {
  return (
    <SummaryItem title="Total Treasury">
      <LoadableContent isLoading={false}>Total Treasury</LoadableContent>
    </SummaryItem>
  );
}
