import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import { useMeasure } from "react-use";

const ArrowRight = dynamic(() => import("@osn/icons/subsquare/ArrowRight"));

function Progress() {
  const [ref, { width }] = useMeasure();

  const barsCountInLine = Math.ceil(Math.floor(width / 4) / 2);

  const bars = [];
  for (let i = 0; i < barsCountInLine; i++) {
    bars.push(<div key={i} className="h-[24px] w-[4px] bg-neutral200" />);
  }

  return (
    <div ref={ref} className="flex gap-[4px] overflow-x-hidden">
      {bars}
    </div>
  );
}

function ProgressStatus({ className, children }) {
  return (
    <div className={cn("flex flex-col gap-[8px] overflow-x-hidden", className)}>
      <Progress />
      <div className="flex items-center text12Medium">{children}</div>
    </div>
  );
}

function PrepareStatus({ className }) {
  return (
    <ProgressStatus className={className}>
      <span className="text-textTertiary mr-[4px]">Preparing</span>
      <Tooltip content="Including preparing and queueing status" />
      <span className="text-textPrimary ml-[8px]">0</span>
    </ProgressStatus>
  );
}

function OngoingStatus({ className }) {
  return (
    <ProgressStatus className={className}>
      <span className="text-textTertiary mr-[4px]">Ongoing</span>
      <Tooltip content="Including deciding and confirming status" />
      <span className="text-textPrimary ml-[8px]">0</span>
    </ProgressStatus>
  );
}

function Arrow() {
  return (
    <div className="p-[2px]">
      <div className="flex items-center justify-center p-[2px] rounded-full bg-neutral200">
        <ArrowRight
          className="[&_path]:stroke-textTertiary"
          width={16}
          height={16}
        />
      </div>
    </div>
  );
}

export default function TrackStatusItem() {
  return (
    <div className="flex flex-col">
      <span className="mb-[16px] text14Bold text-textPrimary">[0] Root</span>
      <div className="flex gap-[16px]">
        <PrepareStatus className="max-w-[300px] basis-[28%]" />
        <Arrow />
        <OngoingStatus className="grow" />
      </div>
    </div>
  );
}
