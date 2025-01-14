import React from "react";
import { Line } from "react-chartjs-2";
import "../globalConfig";
import hoverLinePlugin from "../plugins/hoverLine";
import { useCurveChartOptions } from "next-common/components/charts/thresholdCurve/utils/options";
import {
  useApprovalThresholdDatasetConfig,
  useSupportThresholdDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import { set } from "lodash-es";

export default function ThresholdCurvesChart({
  width,
  height,
  scalesX = true,
  scalesY = true,
  layoutPadding,
  labels = [],
  supportData = [],
  approvalData = [],
}) {
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  const chartData = {
    labels,
    datasets: [supportThresholdConfig, approvalThresholdConfig],
  };

  let options = useCurveChartOptions(labels, {
    label(tooltipItem) {
      const { dataIndex, dataset } = tooltipItem;

      // Display approval at the second line
      if (dataset.label === chartData.datasets[1].label) {
        const approvalThreshold = Number(
          chartData.datasets[1].data[dataIndex],
        ).toFixed(2);
        const supportThreshold = Number(
          chartData.datasets[0].data[dataIndex],
        ).toFixed(2);

        return [
          `Approval: ${approvalThreshold}%`,
          `Support: ${supportThreshold}%`,
        ];
      }

      return null;
    },
  });
  set(options, "scales.x.display", scalesX);
  set(options, "scales.y.display", scalesY);
  set(options, "layout.padding", layoutPadding);

  return (
    <div style={{ height, width }}>
      <Line data={chartData} options={options} plugins={[hoverLinePlugin]} />
    </div>
  );
}
