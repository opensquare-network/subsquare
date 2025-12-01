import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  useProjectBarChartOptions,
  useProjectDoughnutChartOptions,
} from "../hooks/useProjectChartConfig";
import "../../../charts/globalConfig";
import { noop } from "lodash-es";
import { labelUnderlinePlugin } from "./labelUnderlinePlugin";
import useBarLeftPadding from "../hooks/useBarLeftPadding";
import useProjectChartOptions from "../hooks/useProjectChartOptions";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

export const PROJECT_CHART_TYPES = {
  BAR: "bar",
  DOUGHNUT: "doughnut",
};

function useProjectChartMeta(type, height) {
  const Component = useMemo(() => {
    if (type === PROJECT_CHART_TYPES.BAR) {
      return Bar;
    }
    return Doughnut;
  }, [type]);

  const plugins =
    type === PROJECT_CHART_TYPES.BAR
      ? [ChartDataLabels, labelUnderlinePlugin]
      : [];

  const defaultStyle =
    type === PROJECT_CHART_TYPES.DOUGHNUT
      ? { width: 190, height: 110 }
      : { height: height || 184 };

  return {
    Component,
    plugins,
    defaultStyle,
  };
}

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
  const barLeftPadding = useBarLeftPadding(type, data);
  const finalOptions = useProjectChartOptions({
    type,
    barOptions,
    doughnutOptions,
    barLeftPadding,
    data,
    onClick,
  });

  const { Component, plugins, defaultStyle } = useProjectChartMeta(
    type,
    height,
  );

  if (!Component || !data) {
    return null;
  }

  return (
    <div style={{ ...defaultStyle, ...style }}>
      <Component data={data} options={finalOptions} plugins={plugins} />
    </div>
  );
}
