import { communityTreasuryProposalBaseUrl } from "next-common/utils/postBaseUrl";
import { getPostLastActivityAt } from "../postUpdatedTime";
import getTreasuryProposalTitle from "./getTreasuryProposalTitle";

export default function normalizeCommunityTreasuryProposalListItem(
  chain,
  item,
) {
  return {
    ...item,
    title: getTreasuryProposalTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${communityTreasuryProposalBaseUrl}/${item.proposalIndex}`,
    value: item.onchainData?.value,
    index: item.proposalIndex,
  };
}
