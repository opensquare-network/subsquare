import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import {
  MemberWarningsPanel,
  PromptButton,
  useDemotionExpiredCount,
  useDemotionExpiringCount,
  useFilterEvidenceByWish,
  useTodoEvidences,
} from ".";
import {
  OffboardClosing,
  OffboardExpired,
} from "next-common/components/pages/fellowship/usePeriodSelect";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import BatchBump from "../batchBump";
import pluralize from "pluralize";

export default function MemberCandidatesWarnings({ className }) {
  const { section } = useCollectivesContext();
  const { members: coreMembers, loading: isMembersLoading } =
    useFellowshipCoreMembers();
  const members = coreMembers?.filter((m) => m.rank <= 0);

  const expiredMembersCount = useDemotionExpiredCount(members);
  const closingMembersCount = useDemotionExpiringCount(members);
  const {
    all: allEvidences,
    toBeHandled: toBeHandledEvidences,
    isLoading: isEvidencesLoading,
  } = useTodoEvidences(members);

  const allPromotionEvidences = useFilterEvidenceByWish(
    allEvidences,
    "promotion",
  );

  const toBeHandledPromotionEvidences = useFilterEvidenceByWish(
    toBeHandledEvidences,
    "promotion",
  );

  const allRetentionEvidences = useFilterEvidenceByWish(
    allEvidences,
    "retention",
  );

  const toBeHandledRetentionEvidences = useFilterEvidenceByWish(
    toBeHandledEvidences,
    "retention",
  );

  const isLoading = isMembersLoading || isEvidencesLoading;

  const filterLinks = {
    evidenceOnly: `/${section}/members?tab=candidates&evidence_only=true`,
    promotionEvidenceOnly: `/${section}/members?tab=candidates&evidence_only=true&wish=promotion`,
    retentionEvidenceOnly: `/${section}/members?tab=candidates&evidence_only=true&wish=retention`,
    [OffboardClosing]: `/${section}/members?tab=candidates&period=offboard_closing`,
    [OffboardExpired]: `/${section}/members?tab=candidates&period=offboard_expired`,
  };

  const promptItems = [
    toBeHandledPromotionEvidences?.length > 0 && (
      <>
        {`⚠️ ${toBeHandledPromotionEvidences?.length} ${pluralize(
          "wish",
          toBeHandledPromotionEvidences?.length,
        )} for promotion from `}
        <PromptButton
          isCandidate
          filterLink={filterLinks.promotionEvidenceOnly}
        >
          {allPromotionEvidences?.length}{" "}
          {pluralize("candidate", allPromotionEvidences?.length)}
        </PromptButton>
        {toBeHandledPromotionEvidences?.length === 1 ? "needs" : "need"}
        {" to be handled."}
      </>
    ),
    toBeHandledRetentionEvidences?.length > 0 && (
      <>
        {`⚠️ ${toBeHandledRetentionEvidences?.length} ${pluralize(
          "wish",
          toBeHandledRetentionEvidences?.length,
        )} for retention from `}
        <PromptButton
          isCandidate
          filterLink={filterLinks.retentionEvidenceOnly}
        >
          {allRetentionEvidences?.length}{" "}
          {pluralize("candidate", allRetentionEvidences?.length)}
        </PromptButton>
        {toBeHandledRetentionEvidences?.length === 1 ? "needs" : "need"}
        {" to be handled."}
      </>
    ),
    toBeHandledEvidences?.length > 0 && (
      <>
        {`⚠️ ${toBeHandledEvidences?.length} out of `}
        <PromptButton isCandidate filterLink={filterLinks.evidenceOnly}>
          {allEvidences?.length} {pluralize("evidence", allEvidences?.length)}
        </PromptButton>
        {toBeHandledEvidences?.length === 1 ? "needs" : "need"}
        {" to be handled."}
      </>
    ),
    closingMembersCount > 0 && (
      <>
        The offboard period of
        <PromptButton isCandidate filterLink={filterLinks[OffboardClosing]}>
          {closingMembersCount} {pluralize("candidate", closingMembersCount)}
        </PromptButton>
        is approaching.
      </>
    ),
    expiredMembersCount && (
      <>
        <PromptButton isCandidate filterLink={filterLinks[OffboardExpired]}>
          {expiredMembersCount} {pluralize("candidate", expiredMembersCount)}
        </PromptButton>
        can be offboarded.
        <BatchBump isCandidate />
      </>
    ),
  ].filter(Boolean);

  return (
    <MemberWarningsPanel
      className={className}
      isLoading={isLoading}
      items={promptItems}
    />
  );
}
