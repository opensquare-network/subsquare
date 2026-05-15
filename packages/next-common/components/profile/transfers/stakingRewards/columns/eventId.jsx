import { useChain } from "next-common/context/chain";
import { getStatescanDomain } from "next-common/utils/statescan";

export function useStakingRewardsEventIdColumn() {
  const chain = useChain();
  const domain = getStatescanDomain(chain);

  return {
    name: "Event ID",
    style: { textAlign: "left", width: "120px", maxWidth: "120px" },
    render: (item) => (
      <a
        key="eventId"
        className="text-theme500"
        href={`https://${domain}.statescan.io/#/events/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
        target="_blank"
        rel="noreferrer"
      >
        {item.indexer.blockHeight}-{item.indexer.eventIndex}
      </a>
    ),
  };
}
