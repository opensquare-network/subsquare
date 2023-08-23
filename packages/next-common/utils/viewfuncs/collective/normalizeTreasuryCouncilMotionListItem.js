import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { getMotionState } from "./common";

export default function normalizeTreasuryCouncilMotionListItem(chain, item) {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    address: item.proposer,
    status: getMotionState(item),
    detailLink: `/treasury-council/motions/${getMotionId(item)}`,
    isTreasury:
      item?.onchainData?.treasuryProposals?.length > 0 ||
      item?.onchainData?.treasuryBounties?.length > 0,
    isDemocracy: item?.onchainData?.externalProposals?.length > 0,
    time: getPostLastActivityAt(item),
  };
}
