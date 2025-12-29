import { useMemo, useState } from "react";
import TabsList from "next-common/components/tabs/list";
import HorizontalTabLabel from "./horizontalTabLabel";
import "../../../../charts/globalConfig";
import CategoriesList from "./categoriesList";

export default function HorizontalTabs() {
  const [activeTabValue, setActiveTabValue] = useState("categories");

  const tabs = useMemo(
    () => [
      {
        value: "Categories",
        label: (
          <HorizontalTabLabel
            label="Categories"
            isActive={activeTabValue === "categories"}
          />
        ),
      },
    ],
    [activeTabValue],
  );

  return (
    <div className="flex flex-col gap-y-6">
      <TabsList
        className="mx-6"
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
        tabs={tabs}
      />
      <HorizontalTabsContent tabValue={activeTabValue} />
    </div>
  );
}

function HorizontalTabsContent({ tabValue }) {
  if (tabValue === "categories") {
    return <CategoriesList />;
  }
  return null;
}
