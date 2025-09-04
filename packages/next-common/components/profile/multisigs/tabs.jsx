import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { cn } from "next-common/utils";
import OwnMultisigs from "next-common/components/profile/multisigs/ownMultisigs";
import SignatoryMultisigs from "next-common/components/profile/multisigs/signatoryMultisigs";

function TabTitle({ active, children }) {
  return (
    <div
      role="button"
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
    >
      {children}
    </div>
  );
}

export default function MultisigsTabs() {
  const tabs = [
    {
      value: "as_multisig_address",
      label({ active }) {
        return <TabTitle active={active}>As a multisig address</TabTitle>;
      },
      content: <OwnMultisigs />,
    },
    {
      value: "as_multisig_signatory",
      label({ active }) {
        return <TabTitle active={active}>As a multisig signatory</TabTitle>;
      },
      content: <SignatoryMultisigs />,
    },
  ].filter(Boolean);

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => {
        setActiveTabValue(tab.value);
      }}
      tabsListDivider={false}
      tabsListClassName="mr-6 h-7 ml-[24px]"
    />
  );
}
