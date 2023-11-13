import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveProposalTemplate from "./activeProposalTemplate";
import { usePageProps } from "next-common/context/page";
import { getActiveProposalReferenda } from "./referenda";
import { useChain } from "next-common/context/chain";
import { getActiveProposalFellowship } from "./fellowship";
import { getActiveProposalDemocracy } from "./democracy";
import { getActiveProposalTreasury } from "./treasury";

export default function ActiveProposals() {
  const chain = useChain();
  const { tracks, fellowshipTracks, summary, activeProposals } = usePageProps();

  const referenda = getActiveProposalReferenda({ tracks, activeProposals });
  const fellowship = getActiveProposalFellowship({
    fellowshipTracks,
    activeProposals,
  });
  const democracy = getActiveProposalDemocracy({ summary, activeProposals });
  const treasury = getActiveProposalTreasury({ summary, activeProposals });

  const items = [referenda, fellowship, democracy, treasury].filter(
    (item) => !item.excludeToChains?.includes?.(chain),
  );

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
