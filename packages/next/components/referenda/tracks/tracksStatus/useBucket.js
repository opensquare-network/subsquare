import Tooltip from "next-common/components/tooltip";
import { useMeasure } from "react-use";
import { startCase } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import Link from "next/link";
import useFetch from "next-common/hooks/useFetch";
import { cn } from "next-common/utils";

function ReferendumItemBar({ referendumIndex, color, status }) {
  const { value: referendumInfo } = useFetch(
    `/api/gov2/referendums/${referendumIndex}?simple=1`,
  );

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

export default function useBucket({
  sections = [],
  maxSize = 0,
  expanded,
  idleItemsColor,
  paddingItemsColor,
}) {
  const [ref, { width }] = useMeasure();

  const bars = [];

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

  const referendaCount = sections.reduce(
    (acc, { referenda }) => acc + referenda.length,
    0,
  );
  if (maxSize > 0 && maxSize > referendaCount) {
    const idleCount = maxSize - referendaCount;
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

  const maxItemsCountInALine = Math.max(
    1,
    Math.ceil(Math.floor(width / 4) / 2),
  );
  const itemsCount = Math.max(maxSize, referendaCount);
  const remainder = itemsCount % maxItemsCountInALine;
  const paddingCount =
    itemsCount === 0 || remainder > 0 ? maxItemsCountInALine - remainder : 0;
  for (let i = 0; i < paddingCount; i++) {
    bars.push(
      <div
        key={`padding-${i}`}
        className="h-[24px] w-[4px]"
        style={{ backgroundColor: paddingItemsColor || "var(--neutral200)" }}
      />,
    );
  }

  const component = (
    <div
      ref={ref}
      className={cn(
        "flex flex-row-reverse gap-[4px] flex-wrap",
        !expanded && "max-h-[24px] overflow-y-hidden",
      )}
    >
      {bars}
    </div>
  );

  return {
    component,
    maxItemsCountInALine,
    itemsCount,
  };
}
