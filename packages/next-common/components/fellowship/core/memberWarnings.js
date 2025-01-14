import { isNil, partition } from "lodash-es";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import { useEffect, useMemo, useState } from "react";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import {
  useCollectivesContext,
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import {
  isDemotionAboutToExpire,
  isDemotionExpired,
  isPromotable,
} from "next-common/utils/collective/demotionAndPromotion";
import dynamic from "next/dynamic";
import BillBoardPanel from "next-common/components/billBoardPanel";
import ShallowLink from "next-common/components/shallowLink";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemFilter } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { cn } from "next-common/utils";
import BatchBump from "./batchBump";

const MenuHorn = dynamic(() => import("@osn/icons/subsquare/MenuHorn"));

function useAvailablePromotionCount() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { members: coreMembers, isLoading } = useFellowshipCoreMembers();
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
  const { members: coreMembers, isLoading } = useFellowshipCoreMembers();

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

function MemberWarningsPanel({ className, isLoading, items }) {
  const icon = (
    <MenuHorn className="[&_path]:fill-theme500" width={24} height={24} />
  );

  if (isLoading) {
    return (
      <BillBoardPanel className={className} icon={icon} isLoading={true} />
    );
  }

  return <BillBoardPanel className={className} icon={icon} items={items} />;
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

  const filterLinks = {
    evidenceOnly: `/${section}/members?evidence_only=true`,
    demotionPeriodAboutToExpire: `/${section}/members?period=demotion_period_about_to_expire`,
    demotionPeriodExpired: `/${section}/members?period=demotion_period_expired`,
    promotable: `/${section}/members?period=promotable`,
  };

  if (isEvidenceLoading || isCheckingDemotion || isPromotionLoading) {
    return <MemberWarningsPanel className={className} isLoading={true} />;
  }

  const promptItems = [
    totalEvidences > 0 && (
      <>
        {evidencesToBeHandled} evidences to be handled in total{" "}
        <PromptButton filterLink={filterLinks.evidenceOnly}>
          {totalEvidences} evidences
        </PromptButton>
        .
      </>
    ),
    expiringMembersCount > 0 && (
      <>
        {"The demotion periods of "}
        <PromptButton filterLink={filterLinks.demotionPeriodAboutToExpire}>
          {expiringMembersCount} members
        </PromptButton>
        {" will expire in under 20 days."}
      </>
    ),
    expiringCandidatesCount > 0 &&
      `${expiringCandidatesCount} candidates' offboard period is about to reached in under 20 days.`,

    expiredMembersCount > 0 && (
      <>
        <PromptButton filterLink={filterLinks.demotionPeriodExpired}>
          {expiredMembersCount} members
        </PromptButton>
        {" can be demoted."}
        <BatchBump />
      </>
    ),
    expiredCandidatesCount > 0 &&
      `${expiredCandidatesCount} candidates' offboard period is reached.`,

    availablePromotionCount > 0 && (
      <>
        Promotions are available for{" "}
        <PromptButton filterLink={filterLinks.promotable}>
          {availablePromotionCount} members
        </PromptButton>
        .
      </>
    ),
  ].filter(Boolean);

  return <MemberWarningsPanel className={className} items={promptItems} />;
}

function PromptButton({ children, filterLink = "" }) {
  const router = useRouter();
  const [flag, setFlag] = useState(false);
  const matched = router.asPath === filterLink;
  const isActive = flag && matched;
  const currentPath = router.asPath.split("?")[0];
  useEffect(() => {
    setFlag(matched);
  }, [matched]);

  return (
    <ShallowLink href={isActive ? currentPath : filterLink} className="mx-1">
      <SecondaryButton
        size="small"
        iconLeft={
          <SystemFilter
            className={cn(
              "w-4 h-4",
              isActive ? "text-theme500" : "text-textTertiary",
            )}
          />
        }
        className={cn(isActive && "text-theme500")}
        onClick={() => {
          setFlag(!flag);
        }}
      >
        {children}
      </SecondaryButton>
    </ShallowLink>
  );
}
