import { getPostLastActivityAt } from "../postUpdatedTime";
import getTreasuryProposalTitle from "./getTreasuryProposalTitle";

export default function normalizeTreasuryProposalListItem(chain, item) {
  return {
    ...item,
    title: getTreasuryProposalTitle(item),
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `/treasury/proposal/${item.proposalIndex}`,
    value: item.onchainData?.value,
    index: item.proposalIndex,
  }
}
