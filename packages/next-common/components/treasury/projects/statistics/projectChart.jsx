import { useMemo, useRef, useState, useEffect, useCallback } from "react";
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

function useProjectChartMeta(type, height) {
  const Component = useMemo(() => {
    if (type === PROJECT_CHART_TYPES.BAR) {
      return Bar;
    }
    return Doughnut;
  }, [type]);

  const defaultStyle =
    type === PROJECT_CHART_TYPES.DOUGHNUT
      ? { width: 190, height: 110 }
      : { height: height || 184 };

  return {
    Component,
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
  const chartRef = useRef(null);
  const [labelPositions, setLabelPositions] = useState([]);

  const barOptions = useProjectBarChartOptions(userOptions);
  const doughnutOptions = useProjectDoughnutChartOptions(category, userOptions);
  const options =
    type === PROJECT_CHART_TYPES.BAR ? barOptions : doughnutOptions;

  const { Component, plugins, defaultStyle } = useProjectChartMeta(
    type,
    height,
  );

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
    if (type !== PROJECT_CHART_TYPES.BAR) {
      return;
    }

    const calculatePositions = () => {
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

      const positions = meta.data.map((element, index) => {
        const label = data?.labels?.[index];
        const value = data?.datasets?.[0]?.data?.[index];

        return {
          x: labelX,
          y: element.y,
          label,
          value,
          index,
        };
      });

      setLabelPositions(positions);
    };

    const chart = chartRef.current;
    let resizeObserver = null;

    if (chart?.canvas) {
      resizeObserver = new ResizeObserver(calculatePositions);
      resizeObserver.observe(chart.canvas);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [type, data]);

  if (!Component || !data) {
    return null;
  }

  return (
    <div
      className="relative flex gap-x-2"
      style={{ ...defaultStyle, ...style }}
    >
      <div style={{ width: FIXED_LABEL_WIDTH }}>
        <BarLabels
          labels={labelPositions}
          type={type}
          onClick={handleLabelClick}
        />
      </div>
      <div className="flex-1">
        <Component
          ref={chartRef}
          data={data}
          options={options}
          plugins={plugins}
        />
      </div>
    </div>
  );
}
