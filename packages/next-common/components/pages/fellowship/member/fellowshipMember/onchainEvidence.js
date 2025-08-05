import { usePageProps } from "next-common/context/page";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import CollectivesProvider from "next-common/context/collectives/collectives";
import Tabs from "next-common/components/tabs";
import { useCallback, useState } from "react";
import { cn } from "next-common/utils";
import EvidenceWish from "next-common/components/pages/fellowship/member/fellowshipMember/evidenceWish";
import EvidenceHistory from "next-common/components/pages/fellowship/member/fellowshipMember/evidenceHistory";
import CollectivesMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/collectivesMember";
import { useRouter } from "next/router";
import { omit } from "lodash-es";

export default function OnchainEvidence() {
  const { fellowshipParams } = usePageProps();

  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <CollectivesProvider params={fellowshipParams} section="fellowship">
        <CollectivesMembersProvider>
          <div>
            <OnchainEvidenceTabs />
          </div>
        </CollectivesMembersProvider>
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
  const router = useRouter();
  const { evidenceTab } = router.query;
  const [activeTabValue, setActiveTabValue] = useState(evidenceTab || "Wish");

  const tabs = [
    {
      value: "Wish",
      label: <TabTitle active={activeTabValue === "Wish"}>Wish</TabTitle>,
      content: <EvidenceWish />,
    },
    {
      value: "History",
      label: <TabTitle active={activeTabValue === "History"}>History</TabTitle>,
      content: <EvidenceHistory />,
    },
  ];

  const handleTabClick = useCallback(
    (tab) => {
      const q = omit(router.query, ["evidenceTab"]);
      if (tab.value === "History") {
        q.evidenceTab = "History";
      }
      router.replace({ pathname: router.pathname, query: q }, undefined, {
        shallow: true,
      });
      setActiveTabValue(tab.value);
    },
    [router],
  );

  return (
    <Tabs
      tabs={tabs}
      tabsListClassName="px-6"
      activeTabValue={activeTabValue}
      tabsListDivider={false}
      onTabClick={handleTabClick}
    />
  );
}
