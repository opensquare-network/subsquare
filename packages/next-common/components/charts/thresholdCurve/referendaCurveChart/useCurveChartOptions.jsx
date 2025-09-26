import { useThemeSetting } from "next-common/context/theme";
import { find, inRange, set } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo } from "react";
import { useCurrentHeightPoints } from "../hooks/useInnerPoints";

export default function useCurveChartOptions(
  labels,
  sourceLabels,
  datasets,
  rangeData,
) {
  const { neutral300, neutral400 } = useThemeSetting();
  const chainSettings = useChainSettings();

  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    layout: {
      padding: 2,
    },
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
          color: neutral300,
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
    },
  };

  const shouldShowVotesScale = useMemo(() => {
    const ayeDataset = find(datasets, { label: "Aye" });
    const nayDataset = find(datasets, { label: "Nay" });
    return ayeDataset?.data.length > 0 || nayDataset?.data.length > 0;
  }, [datasets]);

  // y1 config
  if (shouldShowVotesScale) {
    const { decimals } = chainSettings || {};
    set(options, "scales.y1", {
      stacked: true,
      position: "right",
      min: 0,
      grid: {
        display: false,
      },
      ticks: {
        callback(value) {
          return abbreviateBigNumber(toPrecision(value, decimals));
        },
      },
    });
  }

  // decision line
  const decisionIndex = useDecisionIndex();
  set(
    options,
    "plugins.annotation.annotations.dividerLine",
    inRange(decisionIndex, rangeData[0], rangeData[1])
      ? {
          type: "line",
          xMin: decisionIndex - rangeData[0],
          xMax: decisionIndex - rangeData[0],
          yMin: 0,
          yMax: "max",
          borderColor: "#9ea9bb",
          borderWidth: 1,
          borderDash: [5, 5],
        }
      : null,
  );

  const { approvalInnerPoint, supportInnerPoint } = useCurrentHeightPoints();
  set(
    options,
    "plugins.annotation.annotations.pointApprovalInner",
    inRange(approvalInnerPoint.xValue, rangeData[0], rangeData[1])
      ? approvalInnerPoint
      : null,
  );
  set(
    options,
    "plugins.annotation.annotations.pointSupportInner",
    inRange(supportInnerPoint.xValue, rangeData[0], rangeData[1])
      ? supportInnerPoint
      : null,
  );

  return options;
}
