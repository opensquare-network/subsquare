import Tab from "../../tab";
import { createGlobalState } from "react-use";

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

export const useVotesBubbleView = createGlobalState("nested");

export default function VotesBubbleViewTabs() {
  const [view, setView] = useVotesBubbleView();

  return (
    <Tab
      selectedTabId={view}
      setSelectedTabId={(id) => {
        setView(id);
      }}
      tabs={tabs}
    />
  );
}
