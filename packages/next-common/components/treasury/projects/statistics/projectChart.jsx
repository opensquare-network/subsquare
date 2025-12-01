import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import {
  useProjectBarChartOptions,
  useProjectDoughnutChartOptions,
} from "../hooks/useProjectChartConfig";
import "../../../charts/globalConfig";
import { noop } from "lodash-es";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

export const PROJECT_CHART_TYPES = {
  BAR: "bar",
  DOUGHNUT: "doughnut",
};

export default function ProjectChart({
  type = PROJECT_CHART_TYPES.DOUGHNUT,
  data,
  category,
  userOptions = {},
  height,
  onClick = noop,
  style,
}) {
  const barOptions = useProjectBarChartOptions(userOptions);
  const doughnutOptions = useProjectDoughnutChartOptions(category, userOptions);

  const finalOptions = useMemo(() => {
    const baseOptions =
      type === PROJECT_CHART_TYPES.BAR ? barOptions : doughnutOptions;

    if (type === PROJECT_CHART_TYPES.BAR) {
      return {
        ...baseOptions,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const index = element.index;
            const label = data?.labels?.[index];
            const value = data?.datasets?.[datasetIndex]?.data?.[index];

            onClick({ label, value, index, datasetIndex, element });
          }
        },
      };
    }

    return baseOptions;
  }, [type, barOptions, doughnutOptions, onClick, data]);

  const Component = useMemo(() => {
    if (type === PROJECT_CHART_TYPES.BAR) {
      return Bar;
    }
    return Doughnut;
  }, [type]);

  if (!Component || !data) {
    return null;
  }

  const defaultStyle =
    type === PROJECT_CHART_TYPES.DOUGHNUT
      ? { width: 190, height: 110 }
      : { height: height || 184 };

  return (
    <div style={{ ...defaultStyle, ...style }}>
      <Component data={data} options={finalOptions} />
    </div>
  );
}
