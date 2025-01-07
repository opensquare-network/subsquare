import { findLastIndex } from "lodash-es";
import { cn } from "next-common/utils";
import Descriptions from "../Descriptions";
import { last } from "lodash-es";
import { isNil } from "lodash-es";
import { useNavCollapsed } from "next-common/context/nav";
import { useWindowSize } from "react-use";
import { MD_SIZE, SM_SIZE } from "next-common/utils/responsive";

function useIsNarrowView() {
  const { width } = useWindowSize();
  const [navCollapsed] = useNavCollapsed();
  if (
    (navCollapsed && width <= SM_SIZE) ||
    (!navCollapsed && width <= MD_SIZE)
  ) {
    return true;
  }

  return false;
}

export default function DataListItem({
  columns,
  row,
  columnClassNames,
  columnStyles,
  highlighted,
  itemClassName,
  descriptionClassName,
}) {
  const { onClick } = row ?? {};
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      role="listitem"
      className={cn(
        "datalist-item group/datalist-item",
        "w-full",
        "flex items-center py-4",
        navCollapsed ? "max-sm:block" : "max-md:block",
        onClick && "cursor-pointer",
        "relative",
        itemClassName,
        highlighted &&
          cn(
            "z-0",
            "after:absolute after:inset-0",
            "after:content-[''] after:bg-neutral200",
            "after:-z-10",
            "after:-mx-6",
          ),
      )}
      onClick={onClick}
    >
      <DesktopContent
        row={row}
        columnClassNames={columnClassNames}
        columnStyles={columnStyles}
      />

      <MobileContent
        row={row}
        columns={columns}
        columnClassNames={columnClassNames}
        descriptionClassName={descriptionClassName}
      />
    </div>
  );
}

function DesktopContent({ row, columnClassNames, columnStyles }) {
  const isNarrowView = useIsNarrowView();
  if (isNarrowView) {
    return null;
  }

  return (
    <div
      className={cn("relative datalist-desktop-item w-full flex items-center")}
    >
      {row.tag}
      {row?.map((item, idx) => (
        <div
          key={idx}
          className={columnClassNames[idx]}
          style={columnStyles[idx]}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function MobileContent({ row = [], columns, descriptionClassName }) {
  const [navCollapsed] = useNavCollapsed();
  const isNarrowView = useIsNarrowView();
  if (!isNarrowView) {
    return null;
  }

  const items = columns.map((col, idx) => {
    return {
      name: col.name,
      value: row?.[idx],
    };
  });

  const hasAction = last(items).name === "";
  const actionIdx = hasAction ? items.length - 1 : -1;
  const action = items[actionIdx];

  const statusIdx = findLastIndex(
    items,
    (item) => item.name?.toLowerCase?.() === "status",
  );
  const hasStatus = statusIdx > -1;

  const restItems = items.filter(
    (_, idx) => ![actionIdx, statusIdx].includes(idx),
  );

  const [first, ...rest] = restItems;

  const descriptionItems = rest
    .map((item) => {
      return (
        !isNil(item?.value) && {
          label: <span className="text-textTertiary">{item.name}</span>,
          value: item.value,
          className: "h-auto mt-2 items-start",
        }
      );
    })
    .filter(Boolean);

  return (
    <div
      className={cn(
        "relative datalist-mobile-item space-y-3",
        navCollapsed ? "sm:py-4" : "md:py-4",
      )}
    >
      {row.tag}
      <div>
        <div className="flex grow items-center justify-between">
          {first.value}
          {action && items[actionIdx]?.value}
        </div>
        {hasStatus && (
          <div className="flex justify-end pt-3">{items[statusIdx]?.value}</div>
        )}
      </div>

      <Descriptions
        bordered={false}
        items={descriptionItems}
        className={descriptionClassName}
      />
    </div>
  );
}
