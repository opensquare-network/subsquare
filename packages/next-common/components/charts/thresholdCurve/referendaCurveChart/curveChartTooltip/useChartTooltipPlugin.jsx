import { find, get, merge, isEqual } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";
import { useState, useCallback } from "react";

export default function useChartTooltipPlugin(options) {
  const chainSettings = useChainSettings();
  const [tooltipData, setTooltipData] = useState(null);
  const externalTooltip = useCallback(
    (context) => {
      const { chart, tooltip } = context;

      if (tooltip.opacity === 0) {
        setTooltipData(null);
        return;
      }
      const dataIndex = tooltip.dataPoints[0].dataIndex;

      const approvalData = get(
        find(chart.data.datasets, { label: "Approval" }),
        ["data", dataIndex],
      );
      const currentApprovalData = get(
        find(chart.data.datasets, { label: "Current Approval" }),
        ["data", dataIndex],
      );

      const supportData = get(find(chart.data.datasets, { label: "Support" }), [
        "data",
        dataIndex,
      ]);
      const currentSupportData = get(
        find(chart.data.datasets, { label: "Current Support" }),
        ["data", dataIndex],
      );

      const nayData = get(find(chart.data.datasets, { label: "Nay" }), [
        "data",
        dataIndex,
      ]);
      const ayeData = get(find(chart.data.datasets, { label: "Aye" }), [
        "data",
        dataIndex,
      ]);

      setTooltipData((prev) => {
        const next = {
          data: {
            dataIndex,
            title: tooltip.title[0],
            afterBody: tooltip.afterBody,
            items: [
              {
                label: "Approval",
                value: `${formatPercentValue(
                  currentApprovalData,
                )} / ${formatPercentValue(approvalData)}`,
              },
              {
                label: "Support",
                value: `${formatPercentValue(
                  currentSupportData,
                )} / ${formatPercentValue(supportData)}`,
              },
              ayeData && {
                label: "Aye",
                value: handleVoteTooltipValue(ayeData, chainSettings),
              },
              nayData && {
                label: "Nay",
                value: handleVoteTooltipValue(nayData, chainSettings),
              },
            ].filter(Boolean),
          },
          position: {
            x: chart.canvas.offsetLeft + tooltip.caretX,
            y: chart.canvas.offsetTop + tooltip.caretY,
            side: tooltip.xAlign,
            align: tooltip.yAlign,
          },
        };
        return isEqual(prev, next) ? prev : next;
      });
    },
    [chainSettings],
  );

  return {
    options: merge(options, {
      plugins: {
        tooltip: {
          enabled: false,
          external: externalTooltip,
          mode: "index",
          intersect: false,
        },
      },
    }),
    tooltipData,
  };
}

function formatPercentValue(value) {
  if (isNaN(value)) {
    return "--";
  }
  return `${Number(value).toFixed(2)}%`;
}

function handleVoteTooltipValue(val, chainSettings) {
  const { decimals, symbol } = chainSettings;

  let value = toPrecision(val, decimals);
  if (Number(value) > 100000 || getEffectiveNumbers(value)?.length >= 11) {
    value = `≈ ${abbreviateBigNumber(value, 2)}`;
  }

  return `${value} ${symbol}`;
}
