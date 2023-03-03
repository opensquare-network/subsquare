import { treasuryProposalBaseUrl } from "../../postBaseUrl";
import { getPostLastActivityAt } from "../postUpdatedTime";
import getTreasuryProposalTitle from "./getTreasuryProposalTitle";

export default function normalizeTreasuryProposalListItem(chain, item) {
  return {
    ...item,
    title: getTreasuryProposalTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${treasuryProposalBaseUrl}/${item.proposalIndex}`,
    value: item.onchainData?.value,
    index: item.proposalIndex,
  };
}
