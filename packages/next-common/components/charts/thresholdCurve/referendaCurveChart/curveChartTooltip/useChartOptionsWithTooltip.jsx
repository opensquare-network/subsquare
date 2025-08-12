import { debounce, find, get, merge } from "lodash-es";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";

export default function useChartOptionsWithTooltip(options, setTooltip) {
  const chainSettings = useChainSettings();
  const decisionIndex = useDecisionIndex();

  const getTitle = (hs) => {
    if (hs < decisionIndex) {
      return `Preparing Time: ${formatHours(hs)}`;
    }
    const x = hs - decisionIndex;

    const days = Math.floor(x / 24);
    const restHs = x - days * 24;
    let result = `Deciding Time: ${formatHours(x)}`;
    if (days > 0) {
      result += ` (${formatDays(days)} ${
        restHs > 0 ? formatHours(restHs) : ""
      })`;
    }

    return result;
  };

  const setData = debounce(setTooltip, 100);

  return merge(options, {
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setData({ ...tooltip, visible: false });
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

          const supportData = get(
            find(chart.data.datasets, { label: "Support" }),
            ["data", dataIndex],
          );
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

          setData({
            visible: true,
            position: {
              x: chart.canvas.offsetLeft + tooltip.caretX,
              y: chart.canvas.offsetTop + tooltip.caretY,
              side: tooltip.xAlign,
              align: tooltip.yAlign,
            },
            data: {
              title: getTitle(dataIndex),
              value: tooltip.body.map((b) => b.lines.join("")).join(""),
              afterBody: tooltip.afterBody,
              data: [
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
          });
        },
      },
    },
  });
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
