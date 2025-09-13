import LineStatistic, {
  LineStatisticItem,
} from "next-common/components/styled/lineStatistic";
import { useFilteredDvReferenda } from "next-common/context/referenda/dv";
import { useInfluenceStatistic } from "next-common/hooks/referenda/useInfluenceStatistic";
import { useMemo } from "react";

export default function InfluenceStatistic({
  delegateReferendumVotesMap = {},
}) {
  const allReferendum = useFilteredDvReferenda();
  const { statistic, loading, error } = useInfluenceStatistic({
    delegateReferendumVotesMap,
    allReferendum,
  });

  const allReferendumCount = useMemo(
    () => allReferendum.length,
    [allReferendum],
  );

  if (loading || error || !allReferendumCount) {
    return null;
  }

  return (
    <LineStatistic>
      <LineStatisticItem
        label="Outcome changed"
        value={`${statistic.influenceCount}(${statistic.percentage}%)`}
      />
      <LineStatisticItem label="Total" value={allReferendumCount} />
    </LineStatistic>
  );
}
