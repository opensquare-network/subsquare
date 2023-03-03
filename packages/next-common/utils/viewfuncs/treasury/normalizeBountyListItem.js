import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { bountyBaseUrl } from "../../postBaseUrl";

export default function normalizeBountyListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    index: item.bountyIndex,
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${bountyBaseUrl}/${item.bountyIndex}`,
    value: item.onchainData?.value,
  };
}
