import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import { useMeasure } from "react-use";
import getStatusColor from "./common";
import { usePageProps } from "next-common/context/page";
import { startCase } from "lodash-es";

const ArrowRight = dynamic(() => import("@osn/icons/subsquare/ArrowRight"));

function ReferendumItemBar({ referendumIndex, color }) {
  return (
    <Tooltip content={`Referendum #${referendumIndex}`}>
      <div className="h-[24px] w-[4px]" style={{ backgroundColor: color }} />
    </Tooltip>
  );
}

function Progress({ sections = [] }) {
  const [ref, { width }] = useMeasure();

  const bars = [];

  for (const { referenda, color } of sections) {
    for (const referendumIndex of referenda) {
      bars.push(
        <ReferendumItemBar
          key={referendumIndex}
          referendumIndex={referendumIndex}
          color={color}
        />,
      );
    }
  }

  const barsCountInALine = Math.ceil(Math.floor(width / 4) / 2);
  const referendaCount = sections.reduce(
    (acc, { referenda }) => acc + referenda.length,
    0,
  );
  const remainder = referendaCount % barsCountInALine;
  const paddingCount =
    referendaCount === 0 || remainder > 0 ? barsCountInALine - remainder : 0;
  for (let i = 0; i < paddingCount; i++) {
    bars.push(
      <div key={`padding-${i}`} className="h-[24px] w-[4px] bg-neutral200" />,
    );
  }

  return (
    <div ref={ref} className="flex flex-row-reverse gap-[4px] flex-wrap">
      {bars}
    </div>
  );
}

function ProgressStatus({ className, children, sections }) {
  return (
    <div className={cn("flex flex-col gap-[8px]", className)}>
      <Progress sections={sections} />
      <div className="flex items-center text12Medium">{children}</div>
    </div>
  );
}

function StatusCounts({ counts }) {
  let content = 0;

  const tooltips = [];
  const numbers = [];
  for (const [status, count] of Object.entries(counts)) {
    if (count > 0) {
      tooltips.push(`${startCase(status)}: ${count}`);
      numbers.push(count);
    }
  }

  if (numbers.length > 0) {
    content = (
      <Tooltip
        content={tooltips.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      >
        {numbers.join("·")}
      </Tooltip>
    );
  }

  return <span className="text-textPrimary ml-[8px]">{content}</span>;
}

function PrepareStatus({ className, preparing, queueing }) {
  const sections = [
    {
      referenda: preparing,
      color: getStatusColor("preparing"),
    },
    {
      referenda: queueing,
      color: getStatusColor("queueing"),
    },
  ];

  return (
    <ProgressStatus className={className} sections={sections}>
      <span className="text-textTertiary mr-[4px]">Preparing</span>
      <Tooltip content="Including preparing and queueing status" />
      <StatusCounts
        counts={{ preparing: preparing.length, queueing: queueing.length }}
      />
    </ProgressStatus>
  );
}

function OngoingStatus({ className, deciding, confirming }) {
  const sections = [
    {
      referenda: deciding,
      color: getStatusColor("deciding"),
    },
    {
      referenda: confirming,
      color: getStatusColor("confirming"),
    },
  ];

  return (
    <ProgressStatus className={className} sections={sections}>
      <span className="text-textTertiary mr-[4px]">Ongoing</span>
      <Tooltip content="Including deciding and confirming status" />
      <StatusCounts
        counts={{ deciding: deciding.length, confirming: confirming.length }}
      />
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

function TrackName({ trackId }) {
  const { tracks } = usePageProps();
  const trackInfo = tracks.find((track) => track.id === trackId);
  const trackName = startCase(trackInfo?.name);

  return (
    <span className="mb-[16px] text14Bold text-textPrimary">
      [{trackId}] {trackName}
    </span>
  );
}

export default function TrackStatusItem({
  trackId,
  preparing,
  queueing,
  deciding,
  confirming,
}) {
  return (
    <div className="flex flex-col p-[24px] border-b border-b-neutral300 last:border-b-0">
      <TrackName trackId={trackId} />
      <div className="flex gap-[16px]">
        <PrepareStatus
          className="max-w-[300px] basis-[28%]"
          preparing={preparing}
          queueing={queueing}
        />
        <Arrow />
        <OngoingStatus
          className="grow"
          deciding={deciding}
          confirming={confirming}
        />
      </div>
    </div>
  );
}
