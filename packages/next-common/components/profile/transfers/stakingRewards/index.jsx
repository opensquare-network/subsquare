import { useEffect, useState } from "react";
import { MapDataList } from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import useStakingRewards from "./useStakingRewards";
import { useStakingRewardsEventIdColumn } from "./columns/eventId";
import { useStakingRewardsTimeAgeColumn } from "./columns/timeAge";
import { useStakingRewardsExtrinsicIdColumn } from "./columns/extrinsicId";
import { useStakingRewardsDestColumn } from "./columns/dest";
import { useStakingRewardsValidatorColumn } from "./columns/validator";
import { useStakingRewardsAmountColumn } from "./columns/amount";

function useColumnsDef() {
  const eventIdColumn = useStakingRewardsEventIdColumn();
  const timeAgeColumn = useStakingRewardsTimeAgeColumn();
  const extrinsicIdColumn = useStakingRewardsExtrinsicIdColumn();
  const destColumn = useStakingRewardsDestColumn();
  const validatorColumn = useStakingRewardsValidatorColumn();
  const amountColumn = useStakingRewardsAmountColumn();

  return [
    eventIdColumn,
    extrinsicIdColumn,
    timeAgeColumn,
    destColumn,
    validatorColumn,
    amountColumn,
  ];
}

export default function StakingRewardsList({ address, onTotalChange }) {
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const { list, total, loading } = useStakingRewards(address, page - 1);

  useEffect(() => {
    onTotalChange?.(loading ? null : total ?? 0);
  }, [total, loading, onTotalChange]);

  useEffect(() => {
    if (!loading && total) {
      setTotalCount(total);
    }
  }, [total, loading]);

  const columnsDef = useColumnsDef();

  return (
    <div>
      <MapDataList
        columnsDef={columnsDef}
        data={list}
        loading={loading}
        noDataText="No staking rewards"
      />
      {pageComponent}
    </div>
  );
}
