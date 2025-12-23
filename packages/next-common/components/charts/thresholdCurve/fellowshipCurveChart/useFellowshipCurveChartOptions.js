import { useMemo } from "react";
import { merge } from "lodash-es";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "next-common/context/post/gov2/percentage";
import {
  useApprovalPercentageLine,
  useSupportPercentageLine,
} from "next-common/components/charts/thresholdCurve/annotations";
import {
  useApprovalPoints,
  useSupportPoints,
} from "next-common/components/charts/thresholdCurve/annotations";
import { useThemeSetting } from "next-common/context/theme";
import useChainOrScanHeight from "next-common/hooks/height";
import { useBlockSteps } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useBeginHeight } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useFellowshipReferendumTally } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import useFellowshipPerbill from "next-common/utils/hooks/fellowship/useFellowshipPerbill";
import { title, commonConfig } from "../utils/options";
import useFellowshipReferendaCurveData from "./useFellowshipReferendaCurveData";
import { inRange } from "lodash-es";

function useFellowshipCurveChartDefaultOptions(labels = []) {
  const { neutral400 } = useThemeSetting();

  const options = {
    ...commonConfig,
    scales: {
      x: {
        type: "linear",
        display: false,
        ticks: {
          stepSize: 1,
          max: labels.length,
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
  rangeData,
) {
  const options = useFellowshipCurveChartDefaultOptions(labels);
  const { supportThresholdLine, approvalThresholdLine } = useThresholdLine();
  const { supportInnerPoint, approvalInnerPoint } = useInnerPoint(
    labels,
    supportData,
    approvalData,
  );

  merge(options, {
    plugins: {
      annotation: {
        annotations: {
          lineSupportThreshold: supportThresholdLine,
          lineApprovalThreshold: approvalThresholdLine,
          pointApprovalInner: inRange(
            approvalInnerPoint.xValue,
            rangeData[0],
            rangeData[1],
          )
            ? approvalInnerPoint
            : null,
          pointSupportInner: inRange(
            supportInnerPoint.xValue,
            rangeData[0],
            rangeData[1],
          )
            ? supportInnerPoint
            : null,
        },
      },
    },
  });
  return options;
}

const useInnerPoint = () => {
  const { labels, supportData, approvalData } =
    useFellowshipReferendaCurveData();

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

const useThresholdLine = () => {
  const tally = useFellowshipReferendumTally();
  const approvalPercentage = useApprovalPercentage(tally);
  const approvalThresholdLine = useApprovalPercentageLine(approvalPercentage);
  const supportPerbill = useFellowshipPerbill();
  const supportPercentage = useSupportPercentage(supportPerbill);
  const supportThresholdLine = useSupportPercentageLine(supportPercentage);
  return {
    approvalThresholdLine,
    supportThresholdLine,
  };
};
