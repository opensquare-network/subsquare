import { getMotionId } from "next-common/utils/motion";
import { getPostUpdatedAt, getTitle } from "./common";

export default function normalizeAllianceMotion(item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/alliance/motion/${ getMotionId(item) }`,
    time: getPostUpdatedAt(item),
  };
}
