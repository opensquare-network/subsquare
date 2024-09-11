import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";

export default function FellowshipTreasury() {
  return (
    <SummaryItem title="Fellowship Treasury">
      <LoadableContent isLoading={false}>Fellowship Treasury</LoadableContent>
    </SummaryItem>
  );
}
