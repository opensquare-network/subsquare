import { usePageProps } from "next-common/context/page";
import { getTrackApprovalCurve } from "next-common/context/post/gov2/curve";
import { useMemo } from "react";
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

  const influenceList = useMemo(() => {
    if (!cohort) {
      return [];
    }
    return allReferendum.map((referendum) => {
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
  }, [allReferendum, delegateReferendumVotesMap, cohort]);

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
  };
}
