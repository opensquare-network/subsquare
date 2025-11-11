import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useEraTimeLeft } from "next-common/hooks/staking/useEraTimeLeft";
import LoadableContent from "next-common/components/common/loadableContent";
import Duration from "next-common/components/duration";

export default function StakingOverviewSummary() {
  const { loading, end } = useEraTimeLeft();

  return (
    <SummaryLayout>
      <SummaryItem title="Average Reward Rate">
        <span>{0}</span>
      </SummaryItem>
      <SummaryItem title="Supply Staked">
        <span>{0}</span>
      </SummaryItem>
      <SummaryItem title="Next Reward Distribution">
        <LoadableContent isLoading={loading} size={16}>
          <Duration time={end} />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
