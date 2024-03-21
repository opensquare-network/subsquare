import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";

export default function SummaryCard({ items }) {
  return (
    <SecondaryCard>
      <Summary items={items} />
    </SecondaryCard>
  );
}
