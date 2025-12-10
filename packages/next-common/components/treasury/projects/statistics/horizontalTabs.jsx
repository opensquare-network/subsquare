import TabsList from "next-common/components/tabs/list";
import "../../../charts/globalConfig";
import { useMemo, useState } from "react";
import BarChart from "./barChart";
import useChartData from "../hooks/useChartData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { colors } from "../const";
import ProjectStatisticsSummary from "./summary";
import useProjectChartInteraction from "../hooks/useProjectChartInteraction";
import HorizontalTabLabel from "./horizontalTabLabel";

export default function HorizontalTabs({ categories = [] }) {
  const [activeTabValue, setActiveTabValue] = useState(categories[0]?.category);

  const tabs = useMemo(
    () =>
      categories.map((category) => ({
        value: category.category,
        label: (
          <HorizontalTabLabel
            category={category}
            categories={categories}
            isActive={activeTabValue === category.category}
          />
        ),
      })),
    [categories, activeTabValue],
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
  const { handleBarClick, ProjectProposalsPopup } = useProjectChartInteraction(
    data?.projects || [],
  );

  const barThickness = 20;
  const barGap = 8;
  const padding = 12;

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
          borderRadius: 5,
          borderSkipped: false,
          barThickness: barThickness,
          maxBarThickness: barThickness,
        },
      ],
    };
  }, [chartData, barThickness]);

  const height = useMemo(() => {
    const projectCount = data?.projects?.length || 0;
    if (projectCount === 0) {
      return padding * 2;
    }
    return padding + (barThickness + barGap) * projectCount - barGap + padding;
  }, [data, barThickness, barGap, padding]);

  if (!mergedData) {
    return null;
  }

  return (
    <>
      <SecondaryCard className="[&>div:first-child]:mb-4">
        <ProjectStatisticsSummary totalFiat={data?.totalFiat} />
        <BarChart data={mergedData} height={height} onClick={handleBarClick} />
      </SecondaryCard>
      {ProjectProposalsPopup}
    </>
  );
}
