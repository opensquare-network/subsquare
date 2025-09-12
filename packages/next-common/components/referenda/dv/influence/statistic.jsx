import LineStatistic, {
  LineStatisticItem,
} from "next-common/components/styled/lineStatistic";
import { usePageProps } from "next-common/context/page";
import { getTrackApprovalCurve } from "next-common/context/post/gov2/curve";
import { useFilteredDvReferenda } from "next-common/context/referenda/dv";
import { getInfluence } from "next-common/hooks/referenda/useInfluence";
import { fetchReferendumData } from "next-common/services/referendaData";
import { toPercentage } from "next-common/utils";
import { useMemo } from "react";
import { useAsync } from "react-use";

export default function InfluenceStatistic({ delegateReferendumVotesMap }) {
  const list = useFilteredDvReferenda();
  const { cohort } = usePageProps();

  const { value, loading, error } = useAsync(async () => {
    const data = await Promise.all(
      list.map((referendum) => fetchReferendumData(referendum.referendumIndex)),
    );
    return data;
  }, [list]);

  const influenceList = useMemo(() => {
    if (!value || !cohort) {
      return [];
    }
    return value.map((referendum) => {
      const approvalCurve = getTrackApprovalCurve(referendum.trackInfo);
      const referendumVotes =
        delegateReferendumVotesMap[referendum.referendumIndex];
      return getInfluence(
        referendum.onchainData.tally,
        referendumVotes,
        cohort,
        approvalCurve,
      );
    });
  }, [value, delegateReferendumVotesMap, cohort]);

  const outcomeChangedValue = useMemo(() => {
    const count = influenceList.filter(
      (influence) => influence.hasInfluence,
    ).length;
    const allCount = list.length;

    return {
      count,
      percentage: toPercentage(count / allCount, 2),
    };
  }, [influenceList, list.length]);

  if (loading || error || !list.length) {
    return null;
  }

  return (
    <LineStatistic>
      <LineStatisticItem
        label="Outcome changed"
        value={`${outcomeChangedValue.count}(${outcomeChangedValue.percentage}%)`}
      />
      <LineStatisticItem label="Total" value={list.length} />
    </LineStatistic>
  );
}
