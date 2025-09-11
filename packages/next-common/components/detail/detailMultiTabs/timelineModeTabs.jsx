import { createGlobalState } from "react-use";
import CommonMultiTabs from "./common";

const timelineTabs = [
  {
    tabId: "normal",
    tabTitle: "Normal",
  },
  {
    tabId: "compact",
    tabTitle: "Compact",
  },
];

const useTimelineMode = createGlobalState(timelineTabs[0].tabId);
export function useIsTimelineCompact() {
  const [timelineMode] = useTimelineMode();
  return timelineMode === "compact";
}

export default function TimelineModeTabs() {
  const [timelineMode, setTimelineMode] = useTimelineMode();

  return (
    <CommonMultiTabs
      tabs={timelineTabs}
      selectedTabId={timelineMode}
      setSelectedTabId={(id) => {
        setTimelineMode(id);
      }}
      label="Timeline"
    />
  );
}
