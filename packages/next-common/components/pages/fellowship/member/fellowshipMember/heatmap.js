import { cn } from "next-common/utils";
import { useMemo, useCallback } from "react";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import {
  BatchProvider,
  BatchResultCacher,
  useValueFromBatchResult,
} from "next-common/context/batch";
import nextApi from "next-common/services/nextApi";
import { isEmpty, startCase } from "lodash-es";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { usePageProps } from "next-common/context/page";

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

export async function getFellowshipReferendaPosts(indexes = []) {
  if (isEmpty(indexes)) {
    return [];
  }
  const q = indexes.join(",");
  const { result } = await nextApi.fetch(
    `fellowship/referenda?simple=1&referendum_index=${q}`,
  );
  return result || [];
}

function ReferendaTitleProvider({ children }) {
  const fetchReferendaList = useCallback(async (referendumIndexes) => {
    const posts = await getFellowshipReferendaPosts(referendumIndexes);
    const referendaMap = Object.fromEntries(
      posts.map((item) => [item.referendumIndex, item]),
    );
    return referendumIndexes.map((i) => referendaMap[i]);
  }, []);

  return (
    <BatchProvider delay={200} batchExecFn={fetchReferendaList}>
      <BatchResultCacher>{children}</BatchResultCacher>
    </BatchProvider>
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
      ) : !value?.title ? (
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

export default function Heatmap({ heatmap, referendumCount }) {
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
        <div className="flex gap-[6px] flex-wrap">
          {Array.from({ length: referendumCount }).map((_, index) => {
            const item = heatmapData[index];
            return (
              <Tooltip
                key={index}
                content={
                  <HeatmapItemTooltip referendumIndex={index} item={item} />
                }
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
              </Tooltip>
            );
          })}
        </div>
      </div>
    </ReferendaTitleProvider>
  );
}
