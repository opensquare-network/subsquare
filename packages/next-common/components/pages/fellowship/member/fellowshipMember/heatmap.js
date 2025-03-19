import { cn } from "next-common/utils";
import { useMemo } from "react";
import Tooltip from "next-common/components/tooltip";

function Square({ className, children }) {
  return (
    <div className="p-[1px]">
      <div className={cn("w-[10px] h-[10px] rounded-[2px]", className)}>
        {children}
      </div>
    </div>
  );
}

function AyeSquare() {
  return <Square className="bg-green300" />;
}

function NaySquare() {
  return <Square className="bg-red300" />;
}

function NoVoteSquare() {
  return <Square className="bg-neutral300" />;
}

function NotEligibleSquare() {
  return (
    <Square className="bg-neutral300 p-[2px]">
      <div className="w-full h-full bg-neutral100"></div>
    </Square>
  );
}

function LegendItem({ children, text }) {
  return (
    <div className="flex gap-[8px] text12Medium items-center">
      {children}
      <span className="text-textSecondary">{text}</span>
    </div>
  );
}

export function LegendBar() {
  return (
    <div className="flex justify-center">
      <div className="flex gap-[16px]">
        <LegendItem text="Aye">
          <AyeSquare />
        </LegendItem>
        <LegendItem text="Nay">
          <NaySquare />
        </LegendItem>
        <LegendItem text="No Vote">
          <NoVoteSquare />
        </LegendItem>
        <LegendItem text="Not Eligible">
          <NotEligibleSquare />
        </LegendItem>
      </div>
    </div>
  );
}

export default function Heatmap({ heatmap, referendumCount }) {
  const heatmapData = useMemo(() => {
    const data = {};
    heatmap?.forEach((item) => {
      data[item.referendumIndex] = item;
    });
    return data;
  }, [heatmap]);

  return (
    <div className="flex justify-center">
      <div className="flex gap-[6px] flex-wrap">
        {Array.from({ length: referendumCount }).map((_, index) => {
          const item = heatmapData[index];
          return (
            <Tooltip content={`Referendum #${index}`} key={index}>
              {!item ? (
                <NotEligibleSquare key={index} />
              ) : !item.isVoted ? (
                <NoVoteSquare key={index} />
              ) : item.vote.isAye ? (
                <AyeSquare key={index} />
              ) : (
                <NaySquare key={index} />
              )}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
