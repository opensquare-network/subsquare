import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import RecentProposalTemplate from "./recentProposalTemplate";
import { useRecentProposalReferenda } from "./referenda";
import { useChain, useChainSettings } from "next-common/context/chain";
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
import isMoonChain from "next-common/utils/isMoonChain";
import { useRecentProposalTreasuryCouncil } from "./treasuryCouncil";
import Chains from "next-common/utils/consts/chains";
import { partition } from "lodash-es";
import EmptyRecentProposals from "./empty";

export default function RecentProposals() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const isPolkadotChain = chain === Chains.polkadot;
  const hasDiscussions = chainSettings.hasDiscussions !== false;

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
            <RecentProposalTemplate key={item.name} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
