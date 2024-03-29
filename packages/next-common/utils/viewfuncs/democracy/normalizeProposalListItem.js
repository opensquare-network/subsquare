import { getTitle } from "../../post";
import { democracyProposalBaseUrl } from "../../postBaseUrl";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeProposalListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    address: item.proposer,
    index: item.proposalIndex,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${democracyProposalBaseUrl}/${item.proposalIndex}`,
  };
}
