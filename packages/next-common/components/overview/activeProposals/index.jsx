import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveProposalTemplate from "./activeProposalTemplate";
import { usePageProps } from "next-common/context/page";
import { getActiveProposalReferenda } from "./referenda";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getActiveProposalFellowship } from "./fellowship";
import { getActiveProposalDemocracy } from "./democracy";
import { getActiveProposalTreasury } from "./treasury";
import { getActiveProposalDiscussions } from "./discussions";
import { getActiveProposalCouncil } from "./council";
import { getActiveProposalTechComm } from "./tc";
import { getActiveProposalFinancialCouncil } from "./financialCouncil";
import { getActiveProposalAlliance } from "./alliance";
import { getActiveProposalAdvisoryCommittee } from "./advisoryCommittee";
import { getActiveProposalOpenTechComm } from "./openTechComm";
import isMoonChain from "next-common/utils/isMoonChain";
import { getActiveProposalTreasuryCouncil } from "./treasuryCouncil";

export default function ActiveProposals() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  const { tracks, fellowshipTracks, summary, activeProposals } = usePageProps();

  const discussions = getActiveProposalDiscussions({ activeProposals });
  const referenda = getActiveProposalReferenda({ tracks, activeProposals });
  const fellowship = getActiveProposalFellowship({
    fellowshipTracks,
    activeProposals,
  });
  const democracy = getActiveProposalDemocracy({ summary, activeProposals });
  const treasury = getActiveProposalTreasury({ summary, activeProposals });
  const council = getActiveProposalCouncil({ summary, activeProposals });
  const tc = getActiveProposalTechComm({ summary, activeProposals });
  const financialCouncil = getActiveProposalFinancialCouncil({
    summary,
    activeProposals,
  });
  const alliance = getActiveProposalAlliance({ summary, activeProposals });
  const advisoryCommittee = getActiveProposalAdvisoryCommittee({
    summary,
    activeProposals,
  });
  const treasuryCouncil = getActiveProposalTreasuryCouncil({
    summary,
    activeProposals,
  });
  const openTechComm = getActiveProposalOpenTechComm({
    summary,
    activeProposals,
  });

  const items = [
    chainSettings.hasReferenda && referenda,
    chainSettings.hasFellowship && fellowship,
    democracy,
    treasury,
    council,
    isMoonChain() && treasuryCouncil,
    tc,
    financialCouncil,
    alliance,
    advisoryCommittee,
    isMoonChain() && openTechComm,
    hasDiscussions && discussions,
  ]
    .filter(Boolean)
    .filter((item) => !item.excludeToChains?.includes?.(chain))
    .filter((item) => !item.archivedToChains?.includes?.(chain));

  return (
    <div>
      <TitleContainer className="mb-4">Active Proposals</TitleContainer>

      <div className="space-y-4">
        {items.map((item) => (
          <ActiveProposalTemplate key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
