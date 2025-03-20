import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import TabsList from "next-common/components/tabs/list";

const Label = tw.button`
  text16Bold
  text-textTertiary
  capitalize
`;

export const TabItems = {
  Referenda: "referenda",
  Membership: "membership",
  Salary: "salary",
};

function TabTitle({ isActive, children }) {
  return (
    <Label className={cn(isActive && "text-textPrimary")}>{children}</Label>
  );
}

export default function Tabs({ activeTabValue, setActiveTabValue }) {
  const tabs = [
    {
      value: TabItems.Referenda,
      label: (
        <TabTitle isActive={activeTabValue === TabItems.Referenda}>
          {TabItems.Referenda}
        </TabTitle>
      ),
    },
    {
      value: TabItems.Membership,
      label: (
        <TabTitle isActive={activeTabValue === TabItems.Membership}>
          {TabItems.Membership}
        </TabTitle>
      ),
    },
    {
      value: TabItems.Salary,
      label: (
        <TabTitle isActive={activeTabValue === TabItems.Salary}>
          {TabItems.Salary}
        </TabTitle>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TabsList
        className="px-6"
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
      />
    </div>
  );
}
