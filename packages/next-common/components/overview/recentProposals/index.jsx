import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import RecentProposalTemplate from "./recentProposalTemplate";
import { useRecentProposalReferenda } from "./referenda";
import { useChain } from "next-common/context/chain";
import { useRecentProposalFellowship } from "./fellowship";
import { useRecentProposalDemocracy } from "./democracy";
import { useRecentProposalTreasury } from "./treasury";
import { useRecentProposalDiscussions } from "./discussions";
import { useRecentProposalCouncil } from "./council";
import { useRecentProposalTechComm } from "./tc";
import { useRecentProposalFinancialCouncil } from "./financialCouncil";
import { useRecentProposalAlliance } from "./alliance";
import { useRecentProposalAdvisoryCommittee } from "./advisoryCommittee";
import { useRecentProposalOpenTechComm } from "./openTechComm";
import { useRecentProposalTreasuryCouncil } from "./treasuryCouncil";
import EmptyRecentProposals from "./empty";

export default function RecentProposals() {
  const chain = useChain();

  const discussions = useRecentProposalDiscussions();
  const referenda = useRecentProposalReferenda();
  const fellowship = useRecentProposalFellowship();
  const democracy = useRecentProposalDemocracy();
  const treasury = useRecentProposalTreasury();
  const council = useRecentProposalCouncil();
  const tc = useRecentProposalTechComm();
  const financialCouncil = useRecentProposalFinancialCouncil();
  const alliance = useRecentProposalAlliance();
  const advisoryCommittee = useRecentProposalAdvisoryCommittee();
  const treasuryCouncil = useRecentProposalTreasuryCouncil();
  const openTechComm = useRecentProposalOpenTechComm();

  const sections = [
    referenda,
    fellowship,
    democracy,
    treasury,
    council,
    treasuryCouncil,
    tc,
    financialCouncil,
    alliance,
    advisoryCommittee,
    openTechComm,
    discussions,
  ]
    .filter(Boolean)
    .filter((item) => !item.excludeToChains?.includes?.(chain))
    .filter((item) => !item.archivedToChains?.includes?.(chain));

  return (
    <div>
      <TitleContainer className="mb-4">Recent Proposals</TitleContainer>

      {!sections.length ? (
        <EmptyRecentProposals />
      ) : (
        <div className="space-y-4">
          {sections.map((item) => (
            <RecentProposalTemplate key={item.name} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
