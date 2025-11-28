import TabsList from "next-common/components/tabs/list";
import "../../../charts/globalConfig";
import { useMemo, useState } from "react";
import BarChart from "./barChart";
import useChartData from "../hooks/useChartData";

export default function HorizontalTabs({ categories = [] }) {
  const [activeTabValue, setActiveTabValue] = useState(categories[0]?.value);

  const tabs = useMemo(
    () =>
      categories.map((category) => ({
        key: category.value,
        value: category.value,
        label: category.label,
      })),
    [categories],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.value === activeTabValue),
    [categories, activeTabValue],
  );

  return (
    <div>
      <TabsList
        className="mx-6"
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
        tabs={tabs}
      />
      {activeCategory && (
        <HorizontalTabsContent
          key={activeCategory.value}
          data={activeCategory}
        />
      )}
    </div>
  );
}

function HorizontalTabsContent({ data = {} }) {
  const chartData = useChartData(data);

  if (!chartData) {
    return null;
  }

  return <BarChart data={chartData} />;
}
