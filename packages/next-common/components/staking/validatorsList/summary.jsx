import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import useActiveValidatorsCount from "next-common/hooks/staking/useActiveValidatorsCount";
import useMaxValidatorsCount from "next-common/hooks/staking/useMaxValidatorsCount";
import useAverageCommission from "next-common/hooks/staking/useAverageCommission";
import { useMemo } from "react";

function AverageCommission() {
  const { averageCommission, loading } = useAverageCommission();
  const commission = useMemo(() => {
    if (loading || !averageCommission) {
      return null;
    }

    return (averageCommission / 10000000).toFixed(2);
  }, [averageCommission, loading]);

  return (
    <SummaryItem title="Average Commission">
      <LoadableContent isLoading={loading} size={16}>
        <span>{commission ?? 0}%</span>
      </LoadableContent>
    </SummaryItem>
  );
}

function TotalValidators() {
  const { validators: allValidators, allValidatorsLoading } =
    useAllValidators();
  const { maxCount, loading: maxCountLoading } = useMaxValidatorsCount();

  const loading = useMemo(() => {
    return allValidatorsLoading || maxCountLoading;
  }, [allValidatorsLoading, maxCountLoading]);

  return (
    <SummaryItem title="Total Validators">
      <LoadableContent isLoading={loading} size={16}>
        <span>{allValidators?.length ?? 0}</span>
        <span className="text-textTertiary">/ {maxCount}</span>
      </LoadableContent>
    </SummaryItem>
  );
}

function ActiveValidators() {
  const { activeCount, loading } = useActiveValidatorsCount();

  return (
    <SummaryItem title="Active Validators">
      <LoadableContent isLoading={loading} size={16}>
        <span>{activeCount}</span>
      </LoadableContent>
    </SummaryItem>
  );
}

// TODO: tooltips
export default function StakingValidatorsSummary() {
  return (
    <SummaryLayout>
      <ActiveValidators />
      <TotalValidators />
      <AverageCommission />
    </SummaryLayout>
  );
}
