import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";

export default function normalizeOpenTechCommProposalListItem(chain, item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/open-techcomm/proposals/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
  };
}
