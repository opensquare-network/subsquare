import Tabs from "next-common/components/tabs";
import { useState } from "react";
import MultisigsAsAddress from "next-common/components/profile/multisigs/multisigsAsAddress";
import MultisigsAsSignatory from "next-common/components/profile/multisigs/multisigsAsSignatory";
import { TabTitle } from "next-common/components/profile/tabs";

export default function MultisigsTabs() {
  const tabs = [
    {
      value: "as_multisig_address",
      label({ active }) {
        return <TabTitle active={active}>As a multisig address</TabTitle>;
      },
      content: <MultisigsAsAddress />,
    },
    {
      value: "as_multisig_signatory",
      label({ active }) {
        return <TabTitle active={active}>As a multisig signatory</TabTitle>;
      },
      content: <MultisigsAsSignatory />,
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
