import voteTabs from "./voteTabs";

export default function filterTabs(filteredAye = [], filteredNay = []) {
  const tabs = [];
  if (filteredAye.length > 0) {
    tabs.push(voteTabs.Aye);
  }
  if (filteredNay.length > 0) {
    tabs.push(voteTabs.Nay);
  }

  return tabs;
}
