import {
  detailMultiTabsVotesStatsView,
  setDetailMultiTabsVotesStatsView,
} from "next-common/store/reducers/detailSlice";
import { useDispatch, useSelector } from "react-redux";
import Tab from "../../tab";

export default function VotesStatsViewTabs() {
  const tabId = useSelector(detailMultiTabsVotesStatsView);
  const dispatch = useDispatch();

  const tabs = [
    {
      tabId: "flattened",
      tabTitle: "Flattened",
    },
    {
      tabId: "nested",
      tabTitle: "Nested",
    },
  ];

  return (
    <Tab
      selectedTabId={tabId}
      setSelectedTabId={(id) => {
        dispatch(setDetailMultiTabsVotesStatsView(id));
      }}
      small
      tabs={tabs}
    />
  );
}
