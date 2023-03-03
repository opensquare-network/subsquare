import isNil from "lodash.isnil";
import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { councilMotionBaseUrl } from "../../postBaseUrl";

function getMotionState(item = {}) {
  if (!item.state) {
    return "Unknown";
  }

  const voting = "Voting";
  if (item.state !== voting) {
    return item.state;
  }

  const { tally: { yesVotes } = {}, voting: { ayes = [] } = {} } =
    item.onchainData || {};
  const ayeCount = isNil(yesVotes) ? ayes.length : yesVotes;
  return isNil(yesVotes) ? voting : `${voting} (${ayeCount})`;
}

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
