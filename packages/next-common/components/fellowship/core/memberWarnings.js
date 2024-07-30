import { isNil } from "lodash-es";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import { useMemo } from "react";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { ONE_DAY } from "next-common/utils/constants";
import { useCoreMembersWithRankContext } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import {
  getDemotionPeriod,
  getPromotionPeriod,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";
import dynamic from "next/dynamic";
import MultiPromptPanel from "next-common/components/multiPromptPanel";

const MenuHorn = dynamic(() => import("@osn/icons/subsquare/MenuHorn"));

const days20 = 20 * ONE_DAY;

function useAvailablePromotionCount() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { coreMembers, isLoading } = useCoreMembersWithRankContext();
  const params = useCoreFellowshipParams();

  const availablePromotionCount = useMemo(() => {
    return (coreMembers || []).reduce((result, coreMember) => {
      const {
        status: { lastPromotion },
        rank,
      } = coreMember;

      const promotionPeriod = getPromotionPeriod(rank, params);
      const gone = latestHeight - lastPromotion;
      const remainingBlocks = getRemainingBlocks(gone, promotionPeriod);

      if (promotionPeriod > 0 && remainingBlocks <= 0) {
        return result + 1;
      }

      return result;
    }, 0);
  }, [coreMembers, isLoading, params]);

  return { availablePromotionCount, isLoading };
}

function useDemotionExpirationCounts() {
  const { coreMembers, isLoading } = useCoreMembersWithRankContext();
  const params = useCoreFellowshipParams();

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const blockTime = useSelector(blockTimeSelector);

  const { members: membersCount, candidates: candidatesCount } = useMemo(() => {
    return (coreMembers || []).reduce(
      (result, coreMember) => {
        const {
          status: { lastProof },
          rank,
        } = coreMember;

        const demotionPeriod = getDemotionPeriod(rank, params);
        const gone = latestHeight - lastProof;
        const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);

        const willExpire =
          demotionPeriod > 0 &&
          new BigNumber(blockTime).multipliedBy(remainingBlocks).lte(days20); // less than 20 days
        if (!willExpire) {
          return result;
        }

        const { members, candidates } = result;
        if (rank > 0) {
          return { members: members + 1, candidates };
        } else {
          return { members, candidates: candidates + 1 };
        }
      },
      { members: 0, candidates: 0 },
    );
  }, [coreMembers, isLoading, latestHeight, blockTime, params]);

  return {
    membersCount,
    candidatesCount,
    isLoading,
  };
}

function useEvidencesStat() {
  const { evidences, isLoading } = useEvidencesCombineReferenda();
  const totalEvidences = (evidences || []).length || 0;

  const evidencesToBeHandled = (evidences || []).filter((evidence) =>
    isNil(evidence.referendumIndex),
  ).length;

  return {
    totalEvidences,
    evidencesToBeHandled,
    isLoading,
  };
}

export default function MemberWarnings({ className }) {
  const {
    membersCount,
    candidatesCount,
    isLoading: isCheckingDemotion,
  } = useDemotionExpirationCounts();

  const { availablePromotionCount, isLoading: isPromotionLoading } =
    useAvailablePromotionCount();

  const {
    totalEvidences,
    evidencesToBeHandled,
    isLoading: isEvidenceLoading,
  } = useEvidencesStat();

  if (isEvidenceLoading || isCheckingDemotion || isPromotionLoading) {
    return null;
  }

  const promptItems = [
    totalEvidences > 0 &&
      `${evidencesToBeHandled} evidences to be handled in total ${totalEvidences} evidences.`,
    membersCount > 0 &&
      `${membersCount} members' demotion period is about to reached in under 20 days.`,
    candidatesCount > 0 &&
      `${candidatesCount} candidates' offboard period is about to reached in under 20 days.`,
    availablePromotionCount > 0 &&
      `Promotions are available for ${availablePromotionCount} members.`,
  ].filter(Boolean);

  return (
    <MultiPromptPanel
      className={className}
      icon={
        <MenuHorn className="[&_path]:fill-theme500" width={24} height={24} />
      }
      items={promptItems}
    />
  );
}
