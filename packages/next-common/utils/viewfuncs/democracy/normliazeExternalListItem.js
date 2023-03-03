import { getTitle } from "../../post";
import { democracyExternalBaseUrl } from "../../postBaseUrl";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeExternalListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    address: item.proposer,
    time: getPostLastActivityAt(item),
    hash: item.externalProposalHash,
    status: item.state ?? "Unknown",
    detailLink: `${democracyExternalBaseUrl}/${item.indexer.blockHeight}_${item.externalProposalHash}`,
  };
}
