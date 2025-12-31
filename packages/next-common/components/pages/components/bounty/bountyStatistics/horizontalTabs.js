import { useMemo, useState } from "react";
import TabsList from "next-common/components/tabs/list";
import HorizontalTabLabel from "./horizontalTabLabel";
import "../../../../charts/globalConfig";
import CategoriesList from "./categoriesList";
import BeneficiariesList from "./beneficiariesList";

export default function HorizontalTabs() {
  const [activeTabValue, setActiveTabValue] = useState("categories");

  const tabs = useMemo(
    () => [
      {
        value: "categories",
        label: (
          <HorizontalTabLabel
            label="Categories"
            isActive={activeTabValue === "categories"}
          />
        ),
      },
      {
        value: "beneficiaries",
        label: (
          <HorizontalTabLabel
            label="Beneficiaries"
            isActive={activeTabValue === "beneficiaries"}
          />
        ),
      },
    ],
    [activeTabValue],
  );

  return (
    <div className="flex flex-col gap-y-6 p-4 py-6">
      <TabsList
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
  if (tabValue === "beneficiaries") {
    return <BeneficiariesList />;
  }
  if (tabValue === "categories") {
    return <CategoriesList />;
  }
  return null;
}
