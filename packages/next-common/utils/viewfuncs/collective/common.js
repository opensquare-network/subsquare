import { isNil } from "lodash-es";

export function getMotionState(item = {}) {
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
