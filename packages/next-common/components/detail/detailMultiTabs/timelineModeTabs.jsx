import Tab from "next-common/components/tab";
import {
  detailMultiTabsTimelineMode,
  setDetailMultiTabsTimelineMode,
} from "next-common/store/reducers/detailSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function TimelineModeTabs() {
  const tabId = useSelector(detailMultiTabsTimelineMode);
  const dispatch = useDispatch();

  const tabs = [
    {
      tabId: "normal",
      tabTitle: "Normal",
    },
    {
      tabId: "compact",
      tabTitle: "Compact",
    },
  ];

  return (
    <Tab
      selectedTabId={tabId}
      setSelectedTabId={(id) => {
        dispatch(setDetailMultiTabsTimelineMode(id));
      }}
      tabs={tabs}
    />
  );
}
