import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveProposalTemplate from "./activeProposalTemplate";
import { usePageProps } from "next-common/context/page";
import { getActiveProposalReferenda } from "./getActiveProposalReferenda";
import { useChain } from "next-common/context/chain";

export default function ActiveProposals() {
  const chain = useChain();
  const { tracks } = usePageProps();

  const referenda = getActiveProposalReferenda({ tracks });

  const items = [referenda].filter(
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
