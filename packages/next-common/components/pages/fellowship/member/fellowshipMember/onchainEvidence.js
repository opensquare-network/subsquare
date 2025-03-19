import { usePageProps } from "next-common/context/page";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import CollectivesProvider from "next-common/context/collectives/collectives";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { cn } from "next-common/utils";
import EvidenceWish from "next-common/components/pages/fellowship/member/fellowshipMember/evidenceWish";

export default function OnchainEvidence() {
  const { fellowshipParams } = usePageProps();

  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <CollectivesProvider params={fellowshipParams} section="fellowship">
        <div>
          <OnchainEvidenceTabs />
          <EvidenceWish />
        </div>
      </CollectivesProvider>
    </ActiveReferendaProvider>
  );
}

function TabTitle({ active, children }) {
  return (
    <div
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
    >
      {children}
    </div>
  );
}

function OnchainEvidenceTabs() {
  const [activeTabValue, setActiveTabValue] = useState("Wish");

  const tabs = [
    {
      value: "Wish",
      label: <TabTitle active={activeTabValue === "Wish"}>Wish</TabTitle>,
      content: null,
    },
  ];

  return (
    <div className="px-6">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        tabsListDivider={false}
        onTabClick={(tab) => setActiveTabValue(tab.value)}
      />
    </div>
  );
}
