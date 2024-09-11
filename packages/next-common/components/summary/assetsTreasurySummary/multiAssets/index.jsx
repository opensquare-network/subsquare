import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";

export default function MultiAssetsTreasury() {
  return (
    <SummaryItem title="Multi Assets Treasury">
      <LoadableContent isLoading={false}>Multi Assets Treasury</LoadableContent>
    </SummaryItem>
  );
}
