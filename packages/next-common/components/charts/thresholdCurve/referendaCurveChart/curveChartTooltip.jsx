import { debounce, find, get, merge } from "lodash-es";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "next-common/utils";
import { useMemo } from "react";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";

export default function CustomChartTooltip({
  visible,
  position,
  data,
  container = document.body,
}) {
  const { left = 0, top = 0 } = useMemo(
    () => container?.getBoundingClientRect() || {},
    [container],
  );

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root
        open={visible}
        style={{
          position: "absolute",
        }}
      >
        <RadixTooltip.Portal container={container || document.body}>
          <RadixTooltip.Content
            className={cn(
              "z-[1000000] rounded py-1.5 px-1.5",
              "text12Normal text-textPrimaryContrast",
              "bg-tooltipBg",
              "[&_.value-display-symbol]:text-inherit pointer-events-none",
            )}
            style={{
              position: "absolute",
              left: left + position?.x,
              top: top + position?.y,
              transform:
                position?.side === "left"
                  ? "translate(6px,-50%)"
                  : "translate(calc(-100% - 6px),-50%)",
            }}
            asChild
          >
            <div className="w-auto p-2">
              <div>
                <div className="text12Bold pb-1 whitespace-nowrap">
                  {data?.title}
                </div>
                <div className=" text12Normal space-y-0.5">
                  {data?.data?.map(({ label, value }) => (
                    <div className="flex whitespace-nowrap" key={label}>
                      <div className="">{label} :</div>
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
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
// useChartOptionsWithTooltip
export const useChartOptionsWithTooltip = (options, setTooltip) => {
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
                  value: `${formatValue(currentApprovalData)} / ${formatValue(
                    approvalData,
                  )}`,
                },
                {
                  label: "Support",
                  value: `${formatValue(currentSupportData)} / ${formatValue(
                    supportData,
                  )}`,
                },
                ayeData && {
                  label: "Aye",
                  value: handleVoteTooltipLabel(ayeData, chainSettings),
                },
                nayData && {
                  label: "Nay",
                  value: handleVoteTooltipLabel(nayData, chainSettings),
                },
              ].filter(Boolean),
            },
          });
        },
      },
    },
  });
};

function formatValue(value) {
  if (isNaN(value)) {
    return "--";
  }
  return `${Number(value).toFixed(2)}%`;
}

function handleVoteTooltipLabel(val, chainSettings) {
  const { decimals, symbol } = chainSettings;

  let value = toPrecision(val, decimals);
  if (Number(value) > 100000 || getEffectiveNumbers(value)?.length >= 11) {
    value = `≈ ${abbreviateBigNumber(value, 2)}`;
  }

  return `${value} ${symbol}`;
}
