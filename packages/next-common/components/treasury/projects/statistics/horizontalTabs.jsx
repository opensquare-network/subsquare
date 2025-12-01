import TabsList from "next-common/components/tabs/list";
import "../../../charts/globalConfig";
import { useMemo, useState, useCallback } from "react";
import BarChart from "./barChart";
import useChartData from "../hooks/useChartData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { colors } from "../const";
import ProjectStatisticsSummary from "./summary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ProjectProposalsPopup = dynamicPopup(() =>
  import("../projectDetailPopup"),
);

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
  const [showProjectProposalsPopup, setShowProjectProposalsPopup] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleBarClick = useCallback(
    ({ label }) => {
      const project = data?.projects?.find((p) => p.name === label);
      if (!project) {
        return;
      }
      setSelectedProject(project);
      setShowProjectProposalsPopup(true);
    },
    [data],
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
      <SecondaryCard>
        <ProjectStatisticsSummary totalFiat={data?.totalFiat} />
        <BarChart data={mergedData} height={height} onClick={handleBarClick} />
      </SecondaryCard>
      {showProjectProposalsPopup && (
        <ProjectProposalsPopup
          onClose={() => setShowProjectProposalsPopup(false)}
          selectedProject={selectedProject}
        />
      )}
    </>
  );
}
