import Tabs from "next-common/components/tabs";
import { useState } from "react";
import MultisigsAsAddress from "next-common/components/profile/multisigs/multisigsAsAddress";
import MultisigsAsSignatory from "next-common/components/profile/multisigs/multisigsAsSignatory";
import { TabTitle } from "next-common/components/profile/tabs";
import { useProfileMultisigsActiveContext } from "next-common/components/profile/multisigs/context/profileMultisigsActiveContext";

export default function MultisigsTabs() {
  const { activeCountAsMultisig, activeCountAsSignatory } =
    useProfileMultisigsActiveContext();

  const tabs = [
    {
      value: "as_multisig_address",
      label({ active }) {
        return <TabTitle active={active}>As a multisig address</TabTitle>;
      },
      content: <MultisigsAsAddress />,
      activeCount: activeCountAsMultisig,
    },
    {
      value: "as_multisig_signatory",
      label({ active }) {
        return <TabTitle active={active}>As a multisig signatory</TabTitle>;
      },
      content: <MultisigsAsSignatory />,
      activeCount: activeCountAsSignatory,
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
