import { createGlobalState } from "react-use";
import CommonMultiTabs from "./common";

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
    <CommonMultiTabs
      selectedTabId={view}
      setSelectedTabId={(id) => {
        setView(id);
      }}
      tabs={tabs}
      label="Votes Bubble"
    />
  );
}
