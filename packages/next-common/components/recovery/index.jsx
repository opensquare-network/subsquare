"use client";

import ListLayout from "next-common/components/layout/ListLayout";
import Tabs from "next-common/components/tabs";
import MyRecoveryContent from "next-common/components/recovery/myRecovery";

const TABS = Object.freeze([
  {
    value: "my_recovery",
    label: "My Recovery",
    url: "/recovery/my-recovery",
  },
  {
    value: "help_others",
    label: "Help Others",
    url: "/recovery/help-others",
  },
  {
    value: "inheritors",
    label: "Inheritants",
    url: "/recovery/inheritants",
  },
]);

const TITLE_MAPS = Object.freeze({
  my_recovery: "My Recovery",
  help_others: "Help Others",
  inheritors: "Inheritants",
});

const DESCRIPTION_MAPS = Object.freeze({
  my_recovery: "Manage your recovery configurations and recoverable accounts",
  help_others:
    "View and manage recovery requests from others where you are a friend",
  inheritors:
    "View recovery configurations where you are designated as an inheritor",
});

function HelpOthersPlaceholder() {
  return (
    <div className="text14Medium text-textTertiary">
      Help Others placeholder content. View recovery requests from others where
      you are a friend.
    </div>
  );
}

function InheritorsPlaceholder() {
  return (
    <div className="text14Medium text-textTertiary">
      Inheritants placeholder content. View recovery configurations where you
      are designated as an inheritor.
    </div>
  );
}

function RecoveryContent({ activeTab }) {
  if (activeTab === "my_recovery") {
    return <MyRecoveryContent />;
  } else if (activeTab === "help_others") {
    return <HelpOthersPlaceholder />;
  } else if (activeTab === "inheritors") {
    return <InheritorsPlaceholder />;
  }
  return null;
}

function HeaderTabs({ activeTab }) {
  return (
    <div className="space-y-4 px-12 max-w-300 max-sm:px-6 mx-auto">
      <Tabs
        activeTabValue={activeTab}
        tabs={TABS}
        tabsContentClassName="hidden"
      />
    </div>
  );
}

export default function Recovery({ activeTab = "my_recovery" }) {
  return (
    <ListLayout
      seoInfo={{ title: "" }}
      title={TITLE_MAPS[activeTab]}
      description={DESCRIPTION_MAPS[activeTab]}
      customTabs={<HeaderTabs activeTab={activeTab} />}
    >
      <div className="flex flex-col gap-4">
        <RecoveryContent activeTab={activeTab} />
      </div>
    </ListLayout>
  );
}
