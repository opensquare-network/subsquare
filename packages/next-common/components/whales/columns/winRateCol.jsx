import { toPercentage } from "next-common/utils";
import { cn } from "next-common/utils";
import Tooltip from "../../tooltip";

export const winRateCol = {
  name: "Win Rate",
  width: 120,
  className: "text-right",
  cellRender(data) {
    const p = toPercentage(data.winVotes / data.votesCount, 1);

    return (
      <Tooltip content={`Win/Participate: ${p}/100`}>
        <span
          className={cn(
            p <= 33 && "text-red500",
            p > 33 && p <= 66 && "text-orange500",
            p > 66 && "text-green500",
          )}
        >
          {p.toFixed(1)}%
        </span>
      </Tooltip>
    );
  },
};
