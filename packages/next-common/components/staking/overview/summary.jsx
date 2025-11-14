import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useEraTimeLeft } from "next-common/hooks/staking/useEraTimeLeft";
import LoadableContent from "next-common/components/common/loadableContent";
import Duration from "next-common/components/duration";
import { useTotalStake } from "next-common/hooks/staking/useTotalStake";
import { useTotalIssuance } from "next-common/hooks/staking/useTotalIssuance";
import { useAverageRewardRate } from "next-common/hooks/staking/useAverageRewardRate";
import { isNil } from "lodash-es";

function NextRewardDistribution() {
  const { loading: loadingEraTimeLeft, end } = useEraTimeLeft();
  return (
    <SummaryItem title="Next Reward Distribution">
      <LoadableContent isLoading={loadingEraTimeLeft} size={16}>
        <Duration time={end} />
      </LoadableContent>
    </SummaryItem>
  );
}

function SupplyStaked() {
  const { loading: loadingTotalStake, totalStake } = useTotalStake();
  const { loading: loadingIssuance, totalIssuance } = useTotalIssuance();
  const isLoading = loadingTotalStake || loadingIssuance;

  let totalStakePercentage = 0;
  if (!isLoading) {
    totalStakePercentage = (
      (Number(totalStake) / Number(totalIssuance)) *
      100
    ).toFixed(2);
  }

  return (
    <SummaryItem title="Supply Staked">
      <LoadableContent isLoading={isLoading} size={16}>
        <span>{totalStakePercentage}%</span>
      </LoadableContent>
    </SummaryItem>
  );
}

function AverageRewardRate() {
  const { value: rate, loading } = useAverageRewardRate();

  return (
    <SummaryItem title="Average Reward Rate">
      <LoadableContent isLoading={loading || isNil(rate)} size={16}>
        <span>{rate?.toFixed(2)}%</span>
      </LoadableContent>
    </SummaryItem>
  );
}

export default function StakingOverviewSummary() {
  return (
    <SummaryLayout>
      <AverageRewardRate />
      <SupplyStaked />
      <NextRewardDistribution />
    </SummaryLayout>
  );
}
