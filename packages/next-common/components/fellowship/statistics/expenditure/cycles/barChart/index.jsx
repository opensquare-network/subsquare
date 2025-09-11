import React from "react";
import { Bar } from "react-chartjs-2";
import "next-common/components/charts/globalConfig.js";
import LegendItem from "next-common/components/charts/legend/item.js";
import { useBarChartOptions as useOptions } from "next-common/components/fellowship/statistics/common.js";

/**
 * @param {Object} props
 * @param {import("react-chartjs-2").ChartProps} props.options
 */
export default function BarChart({
  data,
  options: userOptions = {},
  noLegend,
  height,
}) {
  const options = useOptions(userOptions);

  return (
    <div>
      <div style={{ height: height || 484 }}>
        <Bar data={data} options={options} />
      </div>

      {!noLegend && (
        <div className="flex items-center justify-center mt-4">
          {data?.datasets?.map?.((item) => {
            if (item.legend === false) {
              return;
            }
            return (
              <LegendItem key={item.label} color={item.backgroundColor}>
                {item.label}
              </LegendItem>
            );
          })}
        </div>
      )}
    </div>
  );
}
