import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveProposalTemplate from "./activeProposalTemplate";
import { usePageProps } from "next-common/context/page";
import { getActiveProposalReferenda } from "./referenda";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getActiveProposalFellowship } from "./fellowship";
import { getActiveProposalDemocracy } from "./democracy";
import { getActiveProposalTreasury } from "./treasury";
import { getActiveDiscussions } from "./discussions";
import { getActiveProposalCouncil } from "./council";
import { getActiveProposalsTechComm } from "./tc";
import { getActiveProposalsFinancialCouncil } from "./financialCouncil";

export default function ActiveProposals() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  const { tracks, fellowshipTracks, summary, activeProposals } = usePageProps();

  const discussions = getActiveDiscussions({ activeProposals });
  const referenda = getActiveProposalReferenda({ tracks, activeProposals });
  const fellowship = getActiveProposalFellowship({
    fellowshipTracks,
    activeProposals,
  });
  const democracy = getActiveProposalDemocracy({ summary, activeProposals });
  const treasury = getActiveProposalTreasury({ summary, activeProposals });
  const council = getActiveProposalCouncil({ summary, activeProposals });
  const tc = getActiveProposalsTechComm({ summary, activeProposals });
  const financialCouncil = getActiveProposalsFinancialCouncil({
    summary,
    activeProposals,
  });

  const items = [
    hasDiscussions && discussions,
    referenda,
    fellowship,
    democracy,
    treasury,
    council,
    tc,
    financialCouncil,
  ]
    .filter(Boolean)
    .filter((item) => !item.excludeToChains?.includes?.(chain));

  return (
    <div>
      <TitleContainer className="mb-4">Active Proposals</TitleContainer>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <ActiveProposalTemplate key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
