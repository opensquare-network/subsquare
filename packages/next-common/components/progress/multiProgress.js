import { useMemo } from "react";
import Tooltip from "../tooltip";
import Progress from ".";

const ensureMax100 = (n) => (Number(n) > 100 ? 100 : Number(n));

export default function MultiProgress({
  progressItems = [],
  bg = "var(--neutral200)",
}) {
  const items = useMemo(() => {
    return progressItems.map((item) => {
      return {
        ...item,
        percentage: ensureMax100(item.percentage),
        start: ensureMax100(item.start),
        length: ensureMax100(item.length),
      };
    });
  }, [progressItems]);

  return (
    <div className="relative rounded h-2 overflow-hidden">
      <Progress bg={bg} />

      <div className="absolute inset-0 h-full w-full">
        {items.map((item, idx) => (
          <Tooltip
            key={idx}
            content={item.tooltipContent}
            className="absolute inset-0"
            style={{
              width: Math.abs(Number(item.length) || 0) + "%",
              left: (Number(item.start) || 0) + "%",
            }}
          >
            <Progress
              percentage={item.percentage}
              fg={item.fg}
              bg={item.bg}
              rounded={false}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
