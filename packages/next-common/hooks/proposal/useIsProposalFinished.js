import { useDetailType } from "next-common/context/page";
import { useOnchainData, useTimelineData } from "next-common/context/post";
import { useEffect, useState } from "react";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";
import { isMotionEnded } from "next-common/utils";
import useIsDemocracyProposalFinished from "next-common/hooks/democracy/proposal/useIsDemocracyProposalFinished";
import useIsDemocracyExternalFinished from "next-common/hooks/democracy/external/useIsDemocracyExternalFinished";
import useIsTreasuryProposalFinished from "next-common/hooks/treasury/proposal/useIsTreasuryProposalFinished";
import useIsTipFinished from "next-common/hooks/treasury/tip/useIsTipFinished";
import useIsBountyFinished from "next-common/hooks/treasury/bounty/useIsBountyFinished";
import useIsChildBountyFinished from "next-common/hooks/treasury/bounty/useIsChildBountyFinished";
import useIsTreasurySpendFinished from "next-common/hooks/treasury/spend/useIsTreasurySpendFinished";

export default function useIsProposalFinished() {
  const type = useDetailType();
  const timeline = useTimelineData();
  const [isFinished, setIsFinished] = useState(null);
  const onchainData = useOnchainData();

  const openGovReferendumFinishedHeight = useReferendumVotingFinishHeight();
  const isDemocracyReferendumVoteFinished = useIsDemocracyVoteFinished();
  const isMotionEnd = isMotionEnded(onchainData);
  const isDemocracyProposalFinished = useIsDemocracyProposalFinished();
  const isDemocracyExternalFinished = useIsDemocracyExternalFinished();
  const isTreasuryProposalFinished = useIsTreasuryProposalFinished();
  const isTipFinished = useIsTipFinished();
  const isBountyFinished = useIsBountyFinished();
  const isChildBountyFinished = useIsChildBountyFinished();
  const isTreasurySpendFinished = useIsTreasurySpendFinished();

  useEffect(() => {
    if (
      [
        detailPageCategory.GOV2_REFERENDUM,
        detailPageCategory.FELLOWSHIP_REFERENDUM,
      ].includes(type)
    ) {
      setIsFinished(!isNil(openGovReferendumFinishedHeight));
    } else if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
      setIsFinished(isDemocracyReferendumVoteFinished);
    } else if (type === detailPageCategory.DEMOCRACY_PROPOSAL) {
      setIsFinished(isDemocracyProposalFinished);
    } else if (type === detailPageCategory.DEMOCRACY_EXTERNAL) {
      setIsFinished(isDemocracyExternalFinished);
    } else if (type === detailPageCategory.TREASURY_PROPOSAL) {
      setIsFinished(isTreasuryProposalFinished);
    } else if (type === detailPageCategory.TREASURY_SPEND) {
      setIsFinished(isTreasurySpendFinished);
    } else if (type === detailPageCategory.TREASURY_TIP) {
      setIsFinished(isTipFinished);
    } else if (type === detailPageCategory.TREASURY_BOUNTY) {
      setIsFinished(isBountyFinished);
    } else if (type === detailPageCategory.TREASURY_CHILD_BOUNTY) {
      setIsFinished(isChildBountyFinished);
    } else if (
      [
        detailPageCategory.COUNCIL_MOTION,
        detailPageCategory.FINANCIAL_MOTION,
        detailPageCategory.ADVISORY_MOTION,
        detailPageCategory.ALLIANCE_MOTION,
        detailPageCategory.TREASURY_COUNCIL_MOTION,
        detailPageCategory.OPEN_TECH_COMM_PROPOSAL,
        detailPageCategory.TECH_COMM_MOTION,
      ].includes(type)
    ) {
      setIsFinished(isMotionEnd);
    } else {
      // set false as default, so we will subscribe proposal post detail by default
      setIsFinished(false);
    }
  }, [
    type,
    timeline,
    openGovReferendumFinishedHeight,
    isDemocracyReferendumVoteFinished,
    isDemocracyProposalFinished,
    isDemocracyExternalFinished,
    isTreasuryProposalFinished,
    isTreasurySpendFinished,
    isTipFinished,
    isBountyFinished,
    isChildBountyFinished,
    isMotionEnd,
  ]);

  return isFinished;
}
