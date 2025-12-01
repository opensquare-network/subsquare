import dynamic from "next/dynamic";
import { usePageProps } from "next-common/context/page";
import { LABELS } from "./const";
import { groupBy, isNil } from "lodash-es";
import { useMemo } from "react";
import BigNumber from "bignumber.js";

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

  return (
    <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      {projectsByCategory.map((data) => (
        <Statistics key={data.category} data={data} />
      ))}
    </div>
  );
}
