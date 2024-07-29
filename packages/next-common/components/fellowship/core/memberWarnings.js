import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import tw from "tailwind-styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import { useMemo } from "react";
import { calculateDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { ONE_DAY } from "next-common/utils/constants";
import { useCoreMembersWithRankContext } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import { calculatePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";

const WarningItem = tw.li`pl-[1em]`;

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
      const { remainingBlocks, promotionPeriod } = calculatePromotionPeriod({
        latestHeight,
        rank,
        lastPromotion,
        params,
      });

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
        const { remainingBlocks, demotionPeriod } = calculateDemotionPeriod({
          latestHeight,
          rank,
          lastProof,
          params,
        });
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

  if (
    isEvidenceLoading ||
    isCheckingDemotion ||
    isPromotionLoading ||
    (totalEvidences <= 0 &&
      membersCount <= 0 &&
      candidatesCount <= 0 &&
      availablePromotionCount <= 0)
  ) {
    return null;
  }

  return (
    <SecondaryCard className={className}>
      <div className="flex gap-[16px]">
        <div>
          <div className="bg-theme100 rounded-[8px] p-[8px]">
            <MenuHorn
              className="[&_path]:fill-theme500"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="text-textPrimary text14Medium">
          <ul className="list-disc list-inside">
            {totalEvidences > 0 && (
              <WarningItem>
                {evidencesToBeHandled} evidences to be handled in total{" "}
                {totalEvidences} evidences.
              </WarningItem>
            )}
            {membersCount > 0 && (
              <WarningItem>
                {`${membersCount} members' demotion period is about to reached in under 20 days.`}
              </WarningItem>
            )}
            {candidatesCount > 0 && (
              <WarningItem>
                {`${candidatesCount} candidates' offboard period is about to reached in under 20 days.`}
              </WarningItem>
            )}
            {availablePromotionCount > 0 && (
              <WarningItem>
                Promotions are available for {availablePromotionCount} members.
              </WarningItem>
            )}
          </ul>
        </div>
      </div>
    </SecondaryCard>
  );
}
