import TabsList from "next-common/components/tabs/list";
import "../../../charts/globalConfig";
import { useMemo, useState } from "react";
import BarChart from "./barChart";
import useChartData from "../hooks/useChartData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

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
    <div className="flex flex-col gap-4">
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

  const height = useMemo(() => {
    return data?.projects?.length * 10 + 80;
  }, [data]);

  if (!chartData) {
    return null;
  }

  return (
    <SecondaryCard>
      <BarChart data={chartData} height={height} />
    </SecondaryCard>
  );
}
