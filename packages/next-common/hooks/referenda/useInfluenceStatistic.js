import { usePageProps } from "next-common/context/page";
import { getTrackApprovalCurve } from "next-common/context/post/gov2/curve";
import { fetchReferendumData } from "next-common/services/referendaData";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { getInfluence } from "./useInfluence";
import { toPercentage } from "next-common/utils";

export function useInfluenceStatistic({
  delegateReferendumVotesMap = {},
  allReferendum = [],
}) {
  const { cohort } = usePageProps();
  const allReferendumCount = useMemo(
    () => allReferendum.length,
    [allReferendum],
  );

  const {
    value: referendumList = [],
    loading,
    error,
  } = useAsync(
    async () =>
      await Promise.all(
        allReferendum.map((referendum) =>
          fetchReferendumData(referendum.referendumIndex),
        ),
      ),
    [allReferendum],
  );

  const influenceList = useMemo(() => {
    if (!cohort) {
      return [];
    }
    return referendumList.map((referendum) => {
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
  }, [referendumList, delegateReferendumVotesMap, cohort]);

  const statistic = useMemo(() => {
    const influenceCount = influenceList.filter(
      (influence) => influence.hasInfluence,
    ).length;

    return {
      influenceCount,
      percentage: toPercentage(influenceCount / allReferendumCount, 2),
      allReferendumCount,
    };
  }, [influenceList, allReferendumCount]);

  return {
    statistic,
    loading,
    error,
  };
}
