import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { getMotionState } from "./common";

export default function normalizeMoonCouncilMotionListItem(chain, item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    address: item.proposer,
    status: getMotionState(item),
    detailLink: `/council/motions/${getMotionId(item)}`,
    isDemocracy: item?.onchainData?.externalProposals?.length > 0,
    time: getPostLastActivityAt(item),
  };
}
