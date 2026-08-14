import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { ProfileFellowshipCoreFeedsServerFirst } from "./feeds";
import ProfileFellowshipCoreRank from "./rank";

function TabPanel({ label, children }) {
  const tabs = [{ label, value: label, content: children }];

  return (
    <NeutralPanel className="p-6">
      <Tabs tabs={tabs} activeTabValue={label} />
    </NeutralPanel>
  );
}

export default function ProfileFellowshipCore() {
  return (
    <div className="space-y-4">
      <TabPanel label="Rank">
        <ProfileFellowshipCoreRank />
      </TabPanel>

      <TabPanel label="Feeds">
        <ProfileFellowshipCoreFeedsServerFirst />
      </TabPanel>
    </div>
  );
}
