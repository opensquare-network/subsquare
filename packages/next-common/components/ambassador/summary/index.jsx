import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function AmbassadorSalarySummary() {
  return (
    <SummaryLayout>
      <SummaryItem title="Claimants">{0}</SummaryItem>
      <SummaryItem title="Registered">{0}</SummaryItem>
      <SummaryItem title="Not Inducted">{0}</SummaryItem>
    </SummaryLayout>
  );
}
