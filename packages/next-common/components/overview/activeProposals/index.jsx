import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveProposalTemplate from "./activeProposalTemplate";
import { usePageProps } from "next-common/context/page";
import { getActiveProposalReferenda } from "./referenda";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getActiveProposalFellowship } from "./fellowship";
import { getActiveProposalDemocracy } from "./democracy";
import { getActiveProposalTreasury } from "./treasury";
import { useRecentProposalDiscussions } from "./discussions";
import { getActiveProposalCouncil } from "./council";
import { getActiveProposalTechComm } from "./tc";
import { getActiveProposalFinancialCouncil } from "./financialCouncil";
import { getActiveProposalAlliance } from "./alliance";
import { getActiveProposalAdvisoryCommittee } from "./advisoryCommittee";
import { getActiveProposalOpenTechComm } from "./openTechComm";
import isMoonChain from "next-common/utils/isMoonChain";
import { getActiveProposalTreasuryCouncil } from "./treasuryCouncil";
import Chains from "next-common/utils/consts/chains";
import partition from "lodash.partition";
import EmptyRecentProposals from "./empty";

export default function ActiveProposals() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const isPolkadotChain = chain === Chains.polkadot;
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  const { overviewSummary, activeProposals } = usePageProps();
  const summary = overviewSummary;
  const tracks = overviewSummary?.gov2ReferendaTracks;
  const fellowshipTracks = overviewSummary?.fellowshipReferendaTracks;

  const discussions = useRecentProposalDiscussions();
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

  const sections = [
    chainSettings.hasReferenda && referenda,
    chainSettings.hasFellowship && fellowship,
    democracy,
    treasury,
    !isPolkadotChain && council,
    isMoonChain() && treasuryCouncil,
    !isPolkadotChain && tc,
    financialCouncil,
    alliance,
    advisoryCommittee,
    isMoonChain() && openTechComm,
    (hasDiscussions || chainSettings.hasDiscussionsForumTopics) && discussions,
  ]
    .filter(Boolean)
    .filter((item) => !item.excludeToChains?.includes?.(chain))
    .filter((item) => !item.archivedToChains?.includes?.(chain));

  const [activeItems] = partition(sections, (item) => item.activeCount > 0);

  return (
    <div>
      <TitleContainer className="mb-4">Recent Proposals</TitleContainer>

      {!activeItems.length ? (
        <EmptyRecentProposals />
      ) : (
        <div className="space-y-4">
          {activeItems.map((item) => (
            <ActiveProposalTemplate key={item.name} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
