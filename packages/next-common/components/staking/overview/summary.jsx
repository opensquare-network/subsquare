import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function StakingOverviewSummary() {
  return (
    <SummaryLayout>
      <SummaryItem title="Average Reward Rate">
        <span>{0}</span>
      </SummaryItem>
      <SummaryItem title="Supply Staked">
        <span>{0}</span>
      </SummaryItem>
      <SummaryItem title="Next Reward Distribution">
        <span>{0}</span>
      </SummaryItem>
    </SummaryLayout>
  );
}
