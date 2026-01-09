import { useRef, useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { isNil, noop } from "lodash-es";
import { useBarChartOptions } from "../hooks/useChartSetting";
import BarLabels from "next-common/components/treasury/projects/statistics/barLabels";
import { PROJECT_CHART_TYPES } from "next-common/components/treasury/projects/statistics/projectChart";

const FIXED_LABEL_WIDTH = 100;

export default function BarChart({
  data,
  userOptions = {},
  height,
  onClick = noop,
  style,
}) {
  const chartRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const barOptions = useBarChartOptions(userOptions);
  const defaultStyle = { height: height || 184 };

  const handleLabelClick = useCallback(
    (position) => {
      if (!isNil(position?.label)) {
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

        return {
          x: labelX,
          y: element.y,
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
