import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { childBountyBaseUrl } from "../../postBaseUrl";
import { getChildBountyDisplayIndex, getChildBountyIndex } from "./childBounty";

export default function normalizeChildBountyListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    index: getChildBountyDisplayIndex(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${childBountyBaseUrl}/${getChildBountyIndex(item)}`,
    value: item.onchainData?.value,
  };
}
