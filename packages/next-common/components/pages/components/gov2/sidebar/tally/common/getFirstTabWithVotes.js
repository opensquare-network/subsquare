import voteTabs from "./voteTabs";

export default function getFirstTabWithVotes(
  filteredAye = [],
  filteredNay = [],
  filteredAbstain = [],
) {
  if (filteredAye.length > 0) {
    return voteTabs.Aye;
  } else if (filteredNay.length > 0) {
    return voteTabs.Nay;
  } else if (filteredAbstain.length > 0) {
    return voteTabs.Abstain;
  }

  // no search result
  return null;
}
