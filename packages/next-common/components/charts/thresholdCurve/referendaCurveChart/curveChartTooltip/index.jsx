import { cn, toPrecision } from "next-common/utils";
import { usePreparingHours } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { memo, useMemo, useState, useCallback } from "react";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { find, get, merge } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";

const CurveChartTooltip = memo(function CurveChartTooltip({
  position,
  data,
  rangeData,
}) {
  const decisionIndex = usePreparingHours();

  const index = data?.dataIndex + rangeData[0];

  const title = useMemo(() => {
    if (index < decisionIndex) {
      return `Preparing Time: ${formatHours(index)}`;
    }
    const x = index - decisionIndex;

    const days = Math.floor(x / 24);
    const restHs = x - days * 24;
    let result = `Deciding Time: ${formatHours(x)}`;
    if (days > 0) {
      result += ` (${formatDays(days)} ${
        restHs > 0 ? formatHours(restHs) : ""
      })`;
    }

    return result;
  }, [decisionIndex, index]);

  if (!data) {
    return null;
  }

  return (
    <div
      className={cn(
        "z-[1000000] rounded p-2 select-none",
        "text12Normal text-textPrimaryContrast",
        "bg-tooltipBg",
        "pointer-events-none transition-all",
      )}
      style={{
        position: "absolute",
        left: position?.x,
        top: position?.y,
        transform:
          position?.side === "left"
            ? "translate(6px,-50%)"
            : position?.side === "right"
            ? "translate(calc(-100% - 6px),-50%)"
            : "translate(6px,-100%)",
      }}
    >
      <div>
        <div>
          <div className="text12Bold pb-1 whitespace-nowrap">{title}</div>
          <div className=" text12Normal space-y-0.5">
            {data?.items?.map(({ label, value }) => (
              <div className="flex whitespace-nowrap" key={label}>
                <div className="">{label} </div>
                <div className="pl-1">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "absolute right-full top-1/2 transform -translate-y-1/2",
            position?.side === "right"
              ? "transform rotate-180 translate-x-full right-0"
              : "",
          )}
        >
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent border-r-tooltipBg"></div>
        </div>
      </div>
    </div>
  );
});

export function useChartTooltipPlugin(options, rangeData) {
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
        return prev?.data.dataIndex === dataIndex &&
          prev?.position?.x === next?.position?.x
          ? prev
          : next;
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
    component: <CurveChartTooltip rangeData={rangeData} {...tooltipData} />,
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
