import {
  detailMultiTabsVotesBubbleView,
  setDetailMultiTabsVotesBubbleView,
} from "next-common/store/reducers/detailSlice";
import { useDispatch, useSelector } from "react-redux";
import Tab from "../../tab";

export default function VotesBubbleViewTabs() {
  const tabId = useSelector(detailMultiTabsVotesBubbleView);
  const dispatch = useDispatch();

  const tabs = [
    {
      tabId: "nested",
      tabTitle: "Nested",
    },
    {
      tabId: "flattened",
      tabTitle: "Flattened",
    },
  ];

  return (
    <Tab
      selectedTabId={tabId}
      setSelectedTabId={(id) => {
        dispatch(setDetailMultiTabsVotesBubbleView(id));
      }}
      tabs={tabs}
    />
  );
}
