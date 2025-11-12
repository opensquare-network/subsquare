import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useEraTimeLeft } from "next-common/hooks/staking/useEraTimeLeft";
import LoadableContent from "next-common/components/common/loadableContent";
import Duration from "next-common/components/duration";
import { useTotalStake } from "next-common/hooks/staking/useTotalStake";
import { useTotalIssuance } from "next-common/hooks/staking/useTotalIssuance";

export default function StakingOverviewSummary() {
  const { loading: loadingEraTimeLeft, end } = useEraTimeLeft();
  const { loading: loadingTotalStake, totalStake } = useTotalStake();
  const { loading: loadingIssuance, totalIssuance } = useTotalIssuance();
  let totalStakePercentage = 0;
  if (!loadingTotalStake && !loadingIssuance) {
    totalStakePercentage = (
      (Number(totalStake) / Number(totalIssuance)) *
      100
    ).toFixed(2);
  }

  return (
    <SummaryLayout>
      <SummaryItem title="Average Reward Rate">
        <span>{0}</span>
      </SummaryItem>
      <SummaryItem title="Supply Staked">
        <LoadableContent
          isLoading={loadingTotalStake || loadingIssuance}
          size={16}
        >
          <span>{totalStakePercentage}%</span>
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Next Reward Distribution">
        <LoadableContent isLoading={loadingEraTimeLeft} size={16}>
          <Duration time={end} />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
