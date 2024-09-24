import Tooltip from "next-common/components/tooltip";
import { useMeasure } from "react-use";
import { startCase } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import Link from "next/link";
import { cn } from "next-common/utils";
import {
  BatchProvider,
  useValueFromBatchResult,
} from "next-common/context/batch";
import { useCallback } from "react";
import useReferendaTrackDetail from "next-common/hooks/referenda/useReferendaTrackDetail";
import { getOpenGovReferendaPosts } from "next-common/utils/posts";

export function BucketProvider({ children }) {
  const fetchReferendaList = useCallback(async (referendumIndexes) => {
    const posts = await getOpenGovReferendaPosts(referendumIndexes);
    const referendaMap = Object.fromEntries(
      posts.map((item) => [item.referendumIndex, item]),
    );
    return referendumIndexes.map((i) => referendaMap[i]);
  }, []);

  return (
    <BatchProvider batchExecFn={fetchReferendaList}>{children}</BatchProvider>
  );
}

function ReferendumItemBar({ referendumIndex, color, status }) {
  const { value: referendumInfo } = useValueFromBatchResult(referendumIndex);
  const { track: trackDetail } = useReferendaTrackDetail(referendumInfo?.track);

  const tooltipContent = (
    <>
      {referendumInfo && (
        <div className="max-w-[360px]">
          Title:{" "}
          {referendumInfo.title ||
            `[${startCase(trackDetail?.name)}] Referendum #${referendumIndex}`}
        </div>
      )}
      <div>
        Index:{" "}
        <Link
          className="underline cursor-pointer"
          href={`/referenda/${referendumIndex}`}
        >
          #{referendumIndex}
        </Link>
      </div>
      {referendumInfo && (
        <div className="flex items-center">
          Proposer:&nbsp;
          <AddressUser
            add={referendumInfo.proposer}
            color="var(--textPrimaryContrast)"
            fontSize={12}
          />
        </div>
      )}
      <div>Status: {startCase(status)}</div>
    </>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div className="h-[24px] w-[4px]" style={{ backgroundColor: color }} />
    </Tooltip>
  );
}

function IdleBars({ capacity, referendaCount, idleItemsColor }) {
  let bars = [];

  if (capacity <= referendaCount) {
    return null;
  }

  const idleCount = capacity - referendaCount;
  for (let i = 0; i < idleCount; i++) {
    bars.push(
      <div
        key={`idle-${i}`}
        className="h-[24px] w-[4px]"
        style={{ backgroundColor: idleItemsColor || "var(--neutral400)" }}
      />,
    );
  }

  return bars;
}

function PaddingBars({
  maxItemsCountInALine,
  currentItemsCount,
  paddingItemsColor,
}) {
  let bars = [];

  const remainder = currentItemsCount % maxItemsCountInALine;
  const paddingCount =
    currentItemsCount === 0 || remainder > 0
      ? maxItemsCountInALine - remainder
      : 0;
  for (let i = 0; i < paddingCount; i++) {
    bars.push(
      <div
        key={`padding-${i}`}
        className="h-[24px] w-[4px]"
        style={{ backgroundColor: paddingItemsColor || "var(--neutral200)" }}
      />,
    );
  }
  return bars;
}

function ReferendaBars({ sections }) {
  let bars = [];

  for (const { referenda, color, status } of sections) {
    for (const referendumIndex of referenda) {
      bars.push(
        <ReferendumItemBar
          key={referendumIndex}
          referendumIndex={referendumIndex}
          color={color}
          status={status}
        />,
      );
    }
  }

  return bars;
}

export default function useBucket({
  sections = [],
  capacity,
  expanded,
  idleItemsColor,
  paddingItemsColor,
}) {
  const [ref, { width }] = useMeasure();

  const referendaCount = sections.reduce(
    (acc, { referenda }) => acc + referenda.length,
    0,
  );
  const maxItemsCountInALine = Math.max(
    1,
    Math.ceil(Math.floor(width / 4) / 2),
  );
  const currentItemsCount = Math.max(capacity || 0, referendaCount);

  const component = (
    <div
      ref={ref}
      className={cn(
        "flex flex-row-reverse gap-[4px] flex-wrap",
        !expanded && "max-h-[24px] overflow-y-hidden",
      )}
    >
      <ReferendaBars sections={sections} />
      {capacity > 0 && (
        <IdleBars
          capacity={capacity}
          referendaCount={referendaCount}
          idleItemsColor={idleItemsColor}
        />
      )}
      <PaddingBars
        maxItemsCountInALine={maxItemsCountInALine}
        currentItemsCount={currentItemsCount}
        paddingItemsColor={paddingItemsColor}
      />
    </div>
  );

  return {
    component,
    maxItemsCountInALine,
    currentItemsCount,
  };
}
