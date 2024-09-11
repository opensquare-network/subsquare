import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";

export default function RelayChainTreasury() {
  return (
    <SummaryItem title="Relay Chain Treasury">
      <LoadableContent isLoading={false}>Relay Chain Treasury</LoadableContent>
    </SummaryItem>
  );
}
