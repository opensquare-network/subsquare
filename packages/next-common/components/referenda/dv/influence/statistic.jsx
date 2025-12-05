import LineStatistic, {
  LineStatisticItem,
} from "next-common/components/styled/lineStatistic";
import { useFilteredDvReferenda } from "next-common/context/referenda/dv";
import { useInfluenceStatistic } from "next-common/hooks/referenda/useInfluenceStatistic";
import { useMemo } from "react";

export default function InfluenceStatistic({
  delegateReferendumVotesMap = {},
}) {
  const { filteredReferenda, loading } = useFilteredDvReferenda();
  const { statistic } = useInfluenceStatistic({
    delegateReferendumVotesMap,
    allReferendum: filteredReferenda,
  });

  const allReferendumCount = useMemo(
    () => filteredReferenda.length,
    [filteredReferenda],
  );

  if (!allReferendumCount || loading) {
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
