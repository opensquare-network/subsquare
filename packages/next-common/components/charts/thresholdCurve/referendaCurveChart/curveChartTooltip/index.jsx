import { cn } from "next-common/utils";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo } from "react";
import { formatDays, formatHours } from "next-common/utils/timeFormat";

export default function CurveChartTooltip({
  visible,
  position,
  data,
  rangeData,
}) {
  const decisionIndex = useDecisionIndex();

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

  if (!visible) {
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
            : "translate(calc(-100% - 6px),-50%)",
      }}
    >
      <div>
        <div>
          <div className="text12Bold pb-1 whitespace-nowrap">{title}</div>
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
    </div>
  );
}
