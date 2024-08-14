import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";

function RetentionTimes({ data }) {
  return <SummaryItem title="Retention Times">{data}</SummaryItem>;
}

export default function StatisticsMembershipSummary({ value = [], loading }) {
  if (loading) {
    // TODO: loading content
    return null;
  }
  return (
    <SecondaryCard>
      <SummaryLayout>
        <RetentionTimes data={234} />
      </SummaryLayout>
    </SecondaryCard>
  );
}
