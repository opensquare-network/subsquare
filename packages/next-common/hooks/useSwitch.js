import { createGlobalState } from "react-use";
import Tab from "next-common/components/tab";

function SwitchTab({ tabs, value, onChange }) {
  return (
    <Tab
      selectedTabId={value}
      setSelectedTabId={onChange}
      className="w-40 h-[28px] rounded-md p-[2px]"
      btnClassName="text12Medium"
      tabs={tabs}
    />
  );
}

function SwitchTitle({ label, value, onChange, tabs }) {
  return (
    <div className="w-full flex justify-between items-center">
      <span className="text14Bold text-textPrimary">{label}</span>
      <SwitchTab value={value} tabs={tabs} onChange={onChange} />
    </div>
  );
}

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
export function useTimelineSwitch() {
  const [timelineMode, setTimelineMode] = useTimelineMode();
  return {
    mode: timelineMode,
    timeModeIsCompact: timelineMode == "compact",
    component: (
      <SwitchTitle
        label="Timeline"
        value={timelineMode}
        tabs={timelineTabs}
        onChange={setTimelineMode}
      />
    ),
  };
}
