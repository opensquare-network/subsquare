import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import {
  MemberWarningsPanel,
  PromptButton,
  useDemotionExpiringCount,
  useEvidencesStat,
} from ".";
import { OffboardClosing } from "next-common/components/pages/fellowship/usePeriodSelect";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function MemberCandidatesWarnings({ className }) {
  const { section } = useCollectivesContext();
  const { members: coreMembers, loading: isMembersLoading } =
    useFellowshipCoreMembers();
  const members = coreMembers?.filter((m) => m.rank <= 0);

  const closingMembersCount = useDemotionExpiringCount(members);
  const {
    totalEvidences,
    evidencesToBeHandled,
    isLoading: isEvidencesLoading,
  } = useEvidencesStat(members);

  const isLoading = isMembersLoading || isEvidencesLoading;

  const filterLinks = {
    evidenceOnly: `/${section}/members?tab=candidates&evidence_only=true`,
    [OffboardClosing]: `/${section}/members?tab=candidates&period=offboard_closing`,
  };

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
    closingMembersCount > 0 && (
      <>
        The offboard period for
        <PromptButton filterLink={filterLinks[OffboardClosing]}>
          {closingMembersCount} candidates
        </PromptButton>
        is approaching.
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
