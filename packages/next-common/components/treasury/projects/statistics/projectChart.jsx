import { useRef, useState, useEffect, useCallback } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import {
  useProjectBarChartOptions,
  useProjectDoughnutChartOptions,
} from "../hooks/useProjectChartConfig";
import "../../../charts/globalConfig";
import { noop } from "lodash-es";
import BarLabels from "./barLabels";
import { FIXED_LABEL_WIDTH } from "../const";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

export const PROJECT_CHART_TYPES = {
  BAR: "bar",
  DOUGHNUT: "doughnut",
};

function ProjectBarChart({
  data,
  userOptions = {},
  height,
  onClick = noop,
  style,
}) {
  const chartRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const barOptions = useProjectBarChartOptions(userOptions);
  const defaultStyle = { height: height || 184 };

  const handleLabelClick = useCallback(
    (position) => {
      if (position.label !== undefined) {
        onClick({
          label: position.label,
          value: position.value,
          index: position.index,
          datasetIndex: 0,
        });
      }
    },
    [onClick],
  );

  useEffect(() => {
    const calculateLabels = () => {
      const chart = chartRef.current;
      if (!chart) {
        return;
      }

      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data) {
        return;
      }

      const chartArea = chart.chartArea;
      const labelX = chartArea?.left ? 8 : 4;

      const labels = meta.data.map((element, index) => {
        const label = data?.labels?.[index];
        const value = data?.datasets?.[0]?.data?.[index];
        const nameAbbr = data?.datasets?.[0]?.nameAbbrs?.[index];

        return {
          x: labelX,
          y: element.y,
          nameAbbr,
          label,
          value,
          index,
        };
      });

      setLabels(labels);
    };

    const chart = chartRef.current;
    let resizeObserver = null;

    if (chart?.canvas) {
      resizeObserver = new ResizeObserver(calculateLabels);
      resizeObserver.observe(chart.canvas);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div
      className="relative flex gap-x-2"
      style={{ ...defaultStyle, ...style }}
    >
      <div style={{ width: FIXED_LABEL_WIDTH }}>
        <BarLabels
          labels={labels}
          type={PROJECT_CHART_TYPES.BAR}
          onClick={handleLabelClick}
        />
      </div>
      <div
        className="flex-1"
        style={{ width: `calc(100% - ${FIXED_LABEL_WIDTH}px)` }}
      >
        <Bar ref={chartRef} data={data} options={barOptions} />
      </div>
    </div>
  );
}

function ProjectDoughnutChart({ data, category, userOptions = {}, style }) {
  const doughnutOptions = useProjectDoughnutChartOptions(category, userOptions);
  const defaultStyle = { width: 190, height: 110 };

  if (!data) {
    return null;
  }

  return (
    <div
      className="relative flex gap-x-2"
      style={{ ...defaultStyle, ...style }}
    >
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
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
  if (type === PROJECT_CHART_TYPES.BAR) {
    return (
      <ProjectBarChart
        data={data}
        userOptions={userOptions}
        height={height}
        onClick={onClick}
        style={style}
      />
    );
  }

  return (
    <ProjectDoughnutChart
      data={data}
      category={category}
      userOptions={userOptions}
      style={style}
    />
  );
}
