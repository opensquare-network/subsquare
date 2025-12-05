import { useThemeSetting } from "next-common/context/theme";
import { useMemo } from "react";
import { colors } from "../const";
import BigNumber from "bignumber.js";

export default function useChartData({ projects, totalFiat, category }) {
  const { neutral100 } = useThemeSetting();

  const data = useMemo(() => {
    if (!projects?.length) {
      return null;
    }
    const projectColors = projects.map(
      (_, index) => colors[index % colors.length],
    );
    const projectNames = projects.map((project) => project.name);
    const projectFiatAtFinals = projects.map((project) => project.fiatAtFinal);
    const projectPercentages = projects.map(
      (project) =>
        BigNumber(project.fiatAtFinal)
          .dividedBy(totalFiat)
          .multipliedBy(100)
          .toFixed(2) + "%",
    );

    return {
      category,
      labels: projectNames,
      datasets: [
        {
          label: "Projects",
          data: projectFiatAtFinals,
          name: projectNames,
          backgroundColor: projectColors,
          borderColor: neutral100,
          borderWidth: 3,
          hoverBorderColor: neutral100,
          hoverBorderWidth: 3,
          borderRadius: 5,
          spacing: 0,
          percentage: projectPercentages,
        },
      ],
    };
  }, [projects, totalFiat, neutral100, category]);

  return data;
}
