"use client";

import ListLayout from "next-common/components/layout/ListLayout";
import Tabs from "next-common/components/tabs";
import MyRecoveryContent from "next-common/components/recovery/myRecovery";
import { RelayChainApiProvider } from "next-common/context/relayChain";

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
    <RelayChainApiProvider>
      <ListLayout
        seoInfo={{ title: "" }}
        title="Recovery"
        description="The recovery allows you to securely designate friends and an inheritor to regain access to your account if you lose your keys. Configure friend groups, and manage recovery requests."
        customTabs={<HeaderTabs activeTab={activeTab} />}
      >
        <div className="flex flex-col gap-4">
          <RecoveryContent activeTab={activeTab} />
        </div>
      </ListLayout>
    </RelayChainApiProvider>
  );
}
