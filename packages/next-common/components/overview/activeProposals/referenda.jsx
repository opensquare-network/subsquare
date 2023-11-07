import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { getFeaturedMenu } from "next-common/utils/consts/menu";
import ActiveProposalTemplate from "./activeProposalTemplate";

export default function ActiveReferenda() {
  const chain = useChain();
  const { tracks, fellowshipTracks, summary } = usePageProps();

  const menu = getFeaturedMenu({ tracks, fellowshipTracks, summary })
    .filter((m) => !m.excludeToChains?.includes?.(chain))
    .filter((m) => m.items);

  return (
    <div className="space-y-4">
      {menu.map((m, idx) => (
        <ActiveProposalTemplate key={idx} {...m} />
      ))}
    </div>
  );
}
