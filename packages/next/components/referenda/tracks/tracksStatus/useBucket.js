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
import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";

export function BucketContext({ children }) {
  const batchExecFn = useCallback(async (keys) => {
    const { result } = await nextApi.fetch(
      `gov2/referendums?simple=1&page_size=${keys.length}&${keys
        .map((k) => `referendum_index=${k}`)
        .join("&")}`,
    );
    if (!result) {
      throw new Error("fetch referendums failed");
    }
    const referendaMap = Object.fromEntries(
      result.items.map((item) => [item.referendumIndex, item]),
    );
    return keys.map((key) => referendaMap[key]);
  }, []);

  return <BatchProvider batchExecFn={batchExecFn}>{children}</BatchProvider>;
}

function ReferendumItemBar({ referendumIndex, color, status }) {
  const { value: referendumInfo } = useValueFromBatchResult(referendumIndex);

  const tooltipContent = (
    <>
      {referendumInfo && (
        <div className="max-w-[360px]">
          Title: {referendumInfo.title || "-"}
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

  if (capacity > 0 && capacity > referendaCount) {
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
  capacity = 0,
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
  const currentItemsCount = Math.max(capacity, referendaCount);

  const component = (
    <div
      ref={ref}
      className={cn(
        "flex flex-row-reverse gap-[4px] flex-wrap",
        !expanded && "max-h-[24px] overflow-y-hidden",
      )}
    >
      <ReferendaBars sections={sections} />
      <IdleBars
        capacity={capacity}
        referendaCount={referendaCount}
        idleItemsColor={idleItemsColor}
      />
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
