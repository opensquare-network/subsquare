import { cn } from "next-common/utils";
import { useMemo, useRef } from "react";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { useValueFromBatchResult } from "next-common/context/batch";
import { startCase } from "lodash-es";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { usePageProps } from "next-common/context/page";
import { ReferendaTitleProvider } from "next-common/context/fellowshipReferenda";
import { useElementRect } from "next-common/hooks/useElementRect";

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

function ReferendumTitle({ referendumIndex }) {
  const { fellowshipTracks } = usePageProps();
  const section = useCollectivesSection();
  const { value, loading } = useValueFromBatchResult(referendumIndex);
  const trackId = value?.track;
  const referendumTrack = useMemo(
    () => fellowshipTracks.find((track) => track.id === trackId),
    [trackId, fellowshipTracks],
  );

  return (
    <div className="flex items-center">
      Referendum:&nbsp;
      <Link className="underline" href={`/${section}/${referendumIndex}`}>
        #{referendumIndex}
      </Link>
      &nbsp;
      {loading ? (
        <FieldLoading size={16} />
      ) : value?.title ? (
        <span>· {value?.title}</span>
      ) : (
        <span>
          · [{startCase(referendumTrack?.name)}] Referendum #{referendumIndex}
        </span>
      )}
    </div>
  );
}

function HeatmapItemTooltip({ referendumIndex, item }) {
  return (
    <div>
      <ReferendumTitle referendumIndex={referendumIndex} />
      <div>
        {!item
          ? "Not Eligible"
          : item?.isVoted
          ? item.vote.isAye
            ? "Vote: Aye"
            : "Vote: Nay"
          : "No Vote"}
      </div>
      {item?.isVoted && <div>Rank: {item.rank}</div>}
      {item?.isVoted && <div>Votes: {item.vote.votes}</div>}
    </div>
  );
}

function calcHeatmapHeight(referendumCount, containerWidth) {
  const squareWidth = 12;
  const squareGap = 6;
  const spaceForOneSquare = squareWidth + squareGap;

  const colsCount =
    Math.floor(containerWidth / spaceForOneSquare) +
    (containerWidth % spaceForOneSquare >= squareWidth ? 1 : 0);

  const rowsCount = Math.ceil(referendumCount / colsCount);
  return rowsCount * 18;
}

export default function Heatmap({ heatmap, referendumCount, highlightRange }) {
  const container = useRef();
  const size = useElementRect(container);

  const [rangeFrom = 1, rangeTo = 0] = highlightRange || [];
  const height = calcHeatmapHeight(referendumCount, size?.width);

  const heatmapData = useMemo(() => {
    const data = {};
    heatmap?.forEach((item) => {
      data[item.referendumIndex] = item;
    });
    return data;
  }, [heatmap]);

  return (
    <ReferendaTitleProvider>
      <div className="flex justify-center">
        <div
          ref={container}
          style={{ height }}
          className="flex flex-col w-full gap-[6px] flex-wrap"
        >
          {Array.from({ length: referendumCount }).map((_, index) => {
            const item = heatmapData[index];
            return (
              <Tooltip
                key={index}
                content={
                  <HeatmapItemTooltip referendumIndex={index} item={item} />
                }
              >
                <div
                  className={cn(
                    index < rangeFrom || index > rangeTo ? "opacity-20" : "",
                  )}
                >
                  {!item ? (
                    <NotEligibleSquare />
                  ) : !item.isVoted ? (
                    <NoVoteSquare />
                  ) : item.vote.isAye ? (
                    <AyeSquare />
                  ) : (
                    <NaySquare />
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </ReferendaTitleProvider>
  );
}
