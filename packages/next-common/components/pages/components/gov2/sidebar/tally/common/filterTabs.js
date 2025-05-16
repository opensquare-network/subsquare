import voteTabs from "./voteTabs";

export default function filterTabs(
  filteredAye = [],
  filteredNay = [],
  filteredAbstain = [],
) {
  const tabs = [];
  if (filteredAye.length > 0) {
    tabs.push(voteTabs.Aye);
  }
  if (filteredNay.length > 0) {
    tabs.push(voteTabs.Nay);
  }
  if (filteredAbstain.length > 0) {
    tabs.push(voteTabs.Abstain);
  }

  return tabs;
}
