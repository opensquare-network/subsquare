import PageTabs from "next-common/components/pageTabs";
import { ModuleTab } from "../votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";

export default function ListTabs() {
  return (
    <div className="md:ml-[24px]">
      <PageTabs
        tabs={[
          {
            name: "Delegated Votes",
            content: <DelegatedVotes />,
            extra: <ModuleTab />,
          },
          {
            name: "Been Delegated",
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
        ]}
      />
    </div>
  );
}
