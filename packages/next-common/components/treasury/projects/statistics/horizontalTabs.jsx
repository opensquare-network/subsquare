import TabsList from "next-common/components/tabs/list";
import "../../../charts/globalConfig";
import { useMemo, useState } from "react";
import BarChart from "./barChart";
import useChartData from "../hooks/useChartData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { colors } from "../const";
import ProjectStatisticsSummary from "./summary";

export default function HorizontalTabs({ categories = [] }) {
  const [activeTabValue, setActiveTabValue] = useState(categories[0]?.category);

  const tabs = useMemo(
    () =>
      categories.map((category) => ({
        value: category.category,
        label: category.label,
      })),
    [categories],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.category === activeTabValue),
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

  const mergedData = useMemo(() => {
    if (!chartData) {
      return null;
    }
    return {
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          backgroundColor: colors[1],
        },
      ],
    };
  }, [chartData]);

  const height = useMemo(() => {
    return data?.projects?.length * 8 + 60;
  }, [data]);

  if (!mergedData) {
    return null;
  }

  return (
    <SecondaryCard>
      <ProjectStatisticsSummary totalFiat={data?.totalFiat} />
      <BarChart data={mergedData} height={height} />
    </SecondaryCard>
  );
}
