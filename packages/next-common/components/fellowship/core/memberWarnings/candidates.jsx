import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import {
  MemberWarningsPanel,
  PromptButton,
  useDemotionExpiredCount,
  useDemotionExpiringCount,
  useTodoEvidences,
} from ".";
import {
  OffboardClosing,
  OffboardExpired,
} from "next-common/components/pages/fellowship/usePeriodSelect";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import BatchBump from "../batchBump";

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

  const isLoading = isMembersLoading || isEvidencesLoading;

  const filterLinks = {
    evidenceOnly: `/${section}/members?tab=candidates&evidence_only=true`,
    [OffboardClosing]: `/${section}/members?tab=candidates&period=offboard_closing`,
    [OffboardExpired]: `/${section}/members?tab=candidates&period=offboard_expired`,
  };

  const promptItems = [
    allEvidences?.length > 0 && (
      <>
        {toBeHandledEvidences?.length} evidences to be handled in total{" "}
        <PromptButton isCandidate filterLink={filterLinks.evidenceOnly}>
          {allEvidences?.length} evidences
        </PromptButton>
        .
      </>
    ),
    closingMembersCount > 0 && (
      <>
        The offboard period of
        <PromptButton isCandidate filterLink={filterLinks[OffboardClosing]}>
          {closingMembersCount} candidates
        </PromptButton>
        is approaching.
      </>
    ),
    expiredMembersCount && (
      <>
        <PromptButton isCandidate filterLink={filterLinks[OffboardExpired]}>
          {expiredMembersCount} candidates
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
