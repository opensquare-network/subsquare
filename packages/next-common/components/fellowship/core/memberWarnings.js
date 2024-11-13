import { isNil } from "lodash-es";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import { useMemo } from "react";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import {
  useCollectivesContext,
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import { useCoreMembersWithRankContext } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import {
  isDemotionAboutToExpire,
  isPromotable,
} from "next-common/utils/collective/demotionAndPromotion";
import dynamic from "next/dynamic";
import BillBoardPanel from "next-common/components/billBoardPanel";
import ShallowLink from "next-common/components/shallowLink";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

const MenuHorn = dynamic(() => import("@osn/icons/subsquare/MenuHorn"));

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

      if (isPromotable({ lastPromotion, rank, latestHeight, params })) {
        return result + 1;
      }

      return result;
    }, 0);
  }, [coreMembers, latestHeight, params]);

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

        const willExpire = isDemotionAboutToExpire({
          lastProof,
          rank,
          params,
          blockTime,
          latestHeight,
        });

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
  }, [coreMembers, latestHeight, blockTime, params]);

  return {
    membersCount,
    candidatesCount,
    isLoading,
  };
}

function useEvidencesStat() {
  const { evidences, isLoading } = useEvidencesCombineReferenda();
  const { members } = useFellowshipCoreMembers();

  const memberEvidences = useMemo(() => {
    return (evidences || []).filter((evidence) => {
      const m = (members || []).find((m) => m.address === evidence.who);
      return m?.rank >= 0;
    });
  }, [evidences, members]);

  const totalEvidences = (memberEvidences || []).length || 0;
  const evidencesToBeHandled = (memberEvidences || []).filter((evidence) =>
    isNil(evidence.referendumIndex),
  ).length;

  return {
    totalEvidences,
    evidencesToBeHandled,
    isLoading,
  };
}

export default function MemberWarnings({ className }) {
  const { section } = useCollectivesContext();
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
    totalEvidences > 0 && (
      <>
        {evidencesToBeHandled} evidences to be handled in total{" "}
        <ShallowLink href={`/${section}/core?evidence_only=true`}>
          {totalEvidences} evidences
        </ShallowLink>
        .
      </>
    ),
    membersCount > 0 && (
      <>
        {"The demotion period of "}
        <ShallowLink
          href={`/${section}/core?period=demotion_period_about_to_expire`}
        >
          {membersCount} members
        </ShallowLink>
        {" expires in under 20 days."}
      </>
    ),
    candidatesCount > 0 &&
      `${candidatesCount} candidates' offboard period is about to reached in under 20 days.`,
    availablePromotionCount > 0 && (
      <>
        Promotions are available for{" "}
        <ShallowLink href={`/${section}/core?period=promotable`}>
          {availablePromotionCount} members
        </ShallowLink>
        .
      </>
    ),
  ].filter(Boolean);

  return (
    <BillBoardPanel
      className={className}
      icon={
        <MenuHorn className="[&_path]:fill-theme500" width={24} height={24} />
      }
      items={promptItems}
    />
  );
}
