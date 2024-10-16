import Tab from "next-common/components/tab";
import { createGlobalState } from "react-use";

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
    <Tab
      selectedTabId={timelineMode}
      setSelectedTabId={(id) => {
        setTimelineMode(id);
      }}
      tabs={timelineTabs}
    />
  );
}
