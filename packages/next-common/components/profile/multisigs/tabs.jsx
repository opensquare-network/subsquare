import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { cn } from "next-common/utils";

function MultisigList() {
  return <div>Multisig List</div>;
}

function MultisigsListAsSignatory() {
  return <div>Multisigs List As Signatory</div>;
}

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
      value: "multisig_list",
      label({ active }) {
        return <TabTitle active={active}>Multisigs</TabTitle>;
      },
      content: <MultisigList />,
    },
    {
      value: "multisigs_as_signatory",
      label({ active }) {
        return <TabTitle active={active}>Multisigs as a Signatory</TabTitle>;
      },
      content: <MultisigsListAsSignatory />,
    },
  ].filter(Boolean);

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <div className="ml-[24px]">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
        tabsListDivider={false}
        tabsListClassName="mr-6 h-7"
      />
    </div>
  );
}
