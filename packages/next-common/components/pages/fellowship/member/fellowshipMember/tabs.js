import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import TabsList from "next-common/components/tabs/list";

const Label = tw.button`
  text16Bold
  text-textTertiary
`;

export default function Tabs({ activeTabValue, setActiveTabValue }) {
  const tabs = [
    {
      value: "referenda",
      label: (
        <Label
          className={cn(activeTabValue === "referenda" && "text-textPrimary")}
        >
          Referenda
        </Label>
      ),
    },
    {
      value: "core",
      label: (
        <Label className={cn(activeTabValue === "core" && "text-textPrimary")}>
          Core
        </Label>
      ),
    },
    {
      value: "salary",
      label: (
        <Label
          className={cn(activeTabValue === "salary" && "text-textPrimary")}
        >
          Salary
        </Label>
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
