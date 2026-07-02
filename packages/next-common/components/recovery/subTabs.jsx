"use client";

import Tabs from "next-common/components/tabs";
import { Title } from "next-common/components/overview/account/styled";

function TabTitle({ active, children }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      {children}
    </Title>
  );
}

const SUB_TABS = [
  {
    value: "my_recovery",
    label: ({ active }) => <TabTitle active={active}>My Recovery</TabTitle>,
    url: "/account/my-recovery",
  },
  {
    value: "help_recover",
    label: ({ active }) => <TabTitle active={active}>Help Others</TabTitle>,
    url: "/account/help-recover",
  },
  {
    value: "inherited",
    label: ({ active }) => <TabTitle active={active}>Inherited</TabTitle>,
    url: "/account/inherited",
  },
];

export default function RecoverySubTabs({ activeTab, className = "" }) {
  return (
    <Tabs
      activeTabValue={activeTab}
      tabs={SUB_TABS}
      tabsListDivider={false}
      tabsListClassName={className}
      tabsContentClassName="hidden"
    />
  );
}
