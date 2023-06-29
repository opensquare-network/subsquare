import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { councilMotionBaseUrl } from "../../postBaseUrl";
import { getMotionState } from "./common";

export default function normalizeCouncilMotionListItem(chain, item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    address: item.proposer,
    status: getMotionState(item),
    detailLink: `${councilMotionBaseUrl}/${getMotionId(item)}`,
    isTreasury:
      item?.onchainData?.treasuryProposals?.length > 0 ||
      item?.onchainData?.treasuryBounties?.length > 0,
    isDemocracy: item?.onchainData?.externalProposals?.length > 0,
    time: getPostLastActivityAt(item),
  };
}
