import {
  detailMultiTabsVotesStatsMode,
  setDetailMultiTabsVotesStatsMode,
} from "next-common/store/reducers/detailSlice";
import { useDispatch, useSelector } from "react-redux";
import Tab from "../../tab";

export default function VotesStatsModeTabs() {
  const tabId = useSelector(detailMultiTabsVotesStatsMode);
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
        dispatch(setDetailMultiTabsVotesStatsMode(id));
      }}
      small
      tabs={tabs}
    />
  );
}
