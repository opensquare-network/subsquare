import TabsList from "next-common/components/tabsList";
import { cn } from "next-common/utils";
import { useState } from "react";
import tw from "tailwind-styled-components";
import ProfileFellowshipCoreSection from "./core";

const Label = tw.button`
  text16Bold
  text-textTertiary
`;

export default function ProfileFellowshipSections() {
  const [activeTab, setActiveTab] = useState("core");

  const tabs = [
    {
      key: "core",
      label: (
        <Label className={cn(activeTab === "core" && "text-textPrimary")}>
          Core
        </Label>
      ),
    },
    {
      key: "salary",
      label: (
        <Label className={cn(activeTab === "salary" && "text-textPrimary")}>
          Salary
        </Label>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TabsList
        tabs={tabs}
        className="px-6 "
        onTabClick={(tab) => {
          setActiveTab(tab.key);
        }}
      />

      {activeTab === "core" && <ProfileFellowshipCoreSection />}
    </div>
  );
}
