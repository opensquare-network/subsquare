import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import VoteActivitySummary from "next-common/components/pages/fellowship/member/fellowshipMember/voteActivitySummary";
import ProfileFellowshipCoreRank from "./core/rank";

function TabPanel({ label, children }) {
  const tabs = [{ label, value: label, content: children }];

  return (
    <NeutralPanel className="p-6">
      <Tabs tabs={tabs} activeTabValue={label} />
    </NeutralPanel>
  );
}

export default function ProfileFellowshipOverview() {
  return (
    <div className="space-y-4">
      <TabPanel label="Rank">
        <ProfileFellowshipCoreRank />
      </TabPanel>

      <TabPanel label="Votes">
        <VoteActivitySummary />
      </TabPanel>
    </div>
  );
}
