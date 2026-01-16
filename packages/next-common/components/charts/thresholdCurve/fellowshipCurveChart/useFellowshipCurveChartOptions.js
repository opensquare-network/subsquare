import { useMemo } from "react";
import { merge } from "lodash-es";
import {
  useApprovalPoints,
  useSupportPoints,
} from "next-common/components/charts/thresholdCurve/annotations";
import { useThemeSetting } from "next-common/context/theme";
import useChainOrScanHeight from "next-common/hooks/height";
import { useBlockSteps } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useBeginHeight } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { title, commonConfig } from "../utils/options";

function useFellowshipCurveChartDefaultOptions(labels = []) {
  const { neutral400 } = useThemeSetting();

  const options = {
    ...commonConfig,
    scales: {
      x: {
        type: "linear",
        display: true,
        ticks: {
          stepSize: 1,
          max: labels.length,
          callback(val) {
            const stepSize = Math.round(labels.length / 3);
            if (
              [0, stepSize * 1, stepSize * 2, labels.length - 1].includes(val)
            ) {
              return val + "hs";
            }
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback(val) {
            return val + "%";
          },
        },
        grid: {
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      hoverLine: {
        lineColor: neutral400,
        lineWidth: 1,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: {
          title,
          label(tooltipItem) {
            const { dataset, parsed } = tooltipItem;
            if (dataset.label === "Approval") {
              const approvalValue = Number(parsed.y).toFixed(2);
              return `Approval: ${approvalValue}%`;
            } else if (dataset.label === "Support") {
              const supportValue = Number(parsed.y).toFixed(2);
              return `Support: ${supportValue}%`;
            }
            return null;
          },
        },
      },
    },
  };

  return options;
}

export default function useFellowshipCurveChartOptions(
  labels = [],
  supportData,
  approvalData,
) {
  const options = useFellowshipCurveChartDefaultOptions(labels);
  const { supportInnerPoint, approvalInnerPoint } = useInnerPoint(
    labels,
    supportData,
    approvalData,
  );

  merge(options, {
    plugins: {
      annotation: {
        annotations: {
          pointApprovalInner: approvalInnerPoint,
          pointSupportInner: supportInnerPoint,
        },
      },
    },
  });
  return options;
}

const useInnerPoint = (labels, supportData, approvalData) => {
  const currentHeight = useChainOrScanHeight();
  const steps = useBlockSteps();
  const beginHeight = useBeginHeight();

  const xValue = useMemo(() => {
    const index = Math.floor((currentHeight - beginHeight) / steps);
    return Math.min(index, labels.length - 1);
  }, [beginHeight, currentHeight, labels.length, steps]);

  const [, supportInnerPoint] = useSupportPoints(
    xValue,
    supportData?.[xValue] / 100,
  );
  const [, approvalInnerPoint] = useApprovalPoints(
    xValue,
    approvalData?.[xValue] / 100,
  );

  return {
    supportInnerPoint,
    approvalInnerPoint,
  };
};
