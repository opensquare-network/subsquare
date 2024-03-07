import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";

export default function SummaryCard({ items }) {
  return (
    <SecondaryCard>
      <SummaryItems items={items} />
    </SecondaryCard>
  );
}
