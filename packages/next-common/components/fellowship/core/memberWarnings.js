import { isNil, partition } from "lodash-es";
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
  isDemotionExpired,
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

function useDemotionExpiringCount(members) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const blockTime = useSelector(blockTimeSelector);
  const params = useCoreFellowshipParams();

  return useMemo(() => {
    return (members || []).reduce((result, coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      if (
        isDemotionAboutToExpire({
          lastProof,
          rank,
          params,
          blockTime,
          latestHeight,
        })
      ) {
        return result + 1;
      }

      return result;
    }, 0);
  }, [members, latestHeight, params, blockTime]);
}

function useDemotionExpiredCount(members) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const params = useCoreFellowshipParams();

  return useMemo(() => {
    return (members || []).reduce((result, coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      if (isDemotionExpired({ lastProof, rank, params, latestHeight })) {
        return result + 1;
      }

      return result;
    }, 0);
  }, [members, latestHeight, params]);
}

function useMemberDemotionExpirationCounts(members) {
  const expiredMembersCount = useDemotionExpiredCount(members);
  const expiringMembersCount = useDemotionExpiringCount(members);
  return { expiredMembersCount, expiringMembersCount };
}

function useDemotionExpirationCounts() {
  const { coreMembers, isLoading } = useCoreMembersWithRankContext();

  const [members, candidates] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  const { expiredMembersCount, expiringMembersCount } =
    useMemberDemotionExpirationCounts(members);

  const {
    expiredMembersCount: expiredCandidatesCount,
    expiringMembersCount: expiringCandidatesCount,
  } = useMemberDemotionExpirationCounts(candidates);

  return {
    expiredMembersCount,
    expiredCandidatesCount,
    expiringMembersCount,
    expiringCandidatesCount,
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
    expiredMembersCount,
    expiredCandidatesCount,
    expiringMembersCount,
    expiringCandidatesCount,
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
    expiringMembersCount > 0 && (
      <>
        {"The demotion period of "}
        <ShallowLink
          href={`/${section}/core?period=demotion_period_about_to_expire`}
        >
          {expiringMembersCount} members
        </ShallowLink>
        {" expires in under 20 days."}
      </>
    ),
    expiringCandidatesCount > 0 &&
      `${expiringCandidatesCount} candidates' offboard period is about to reached in under 20 days.`,

    expiredMembersCount > 0 && (
      <>
        {"The demotion period of "}
        <ShallowLink href={`/${section}/core?period=demotion_period_expired`}>
          {expiredMembersCount} members
        </ShallowLink>
        {" is reached."}
      </>
    ),
    expiredCandidatesCount > 0 &&
      `${expiredCandidatesCount} candidates' offboard period is reached.`,

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
