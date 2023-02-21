import { getTitle } from "@subsquare/next/utils/viewfuncs/common";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeProposalListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    index: item.proposalIndex,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `/democracy/proposal/${ item.proposalIndex }`,
  }
}
