import { getMotionId } from "../../motion";
import { getTitle } from "../../post";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeAllianceMotion(item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/alliance/motions/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
  };
}
