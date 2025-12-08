import dynamic from "next/dynamic";
import { usePageProps } from "next-common/context/page";
import { GRID_LABELS, LABELS, HORIZONTAL_LABELS } from "./const";
import { groupBy, isNil } from "lodash-es";
import { useMemo } from "react";
import BigNumber from "bignumber.js";

const HorizontalTabs = dynamic(() => import("./statistics/horizontalTabs"), {
  ssr: false,
});
const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

export default function TreasuryProjects() {
  const { projects = [] } = usePageProps();

  const projectsByCategory = useMemo(() => {
    const grouped = groupBy(projects, "category");

    return Object.entries(grouped)
      .map(([category, projects]) => ({
        label: LABELS[category],
        category,
        projects: projects.sort((a, b) => b.fiatAtFinal - a.fiatAtFinal),
        totalFiat: projects.reduce(
          (acc, project) => acc.plus(BigNumber(project.fiatAtFinal)),
          BigNumber(0),
        ),
      }))
      .sort((a, b) => b.totalFiat.comparedTo(a.totalFiat))
      .filter((item) => !isNil(item.label));
  }, [projects]);

  const categories = useMemo(() => {
    return {
      grid: getChartData(projectsByCategory, GRID_LABELS).sort((a, b) =>
        b.totalFiat.comparedTo(a.totalFiat),
      ),
      horizontal: getChartData(projectsByCategory, HORIZONTAL_LABELS),
    };
  }, [projectsByCategory]);

  return (
    <>
      <GridChart categories={categories.grid} />
      <HorizontalTabs categories={categories.horizontal} />
    </>
  );
}

function GridChart({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      {categories.map((data) => (
        <Statistics key={data.category} data={data} />
      ))}
    </div>
  );
}

function getChartData(projectsByCategory = [], categories = {}) {
  return Object.entries(categories)
    .map(([value]) =>
      projectsByCategory.find((item) => item.category === value),
    )
    .filter(Boolean);
}
