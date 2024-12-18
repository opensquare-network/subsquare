import { findLastIndex } from "lodash-es";
import { cn } from "next-common/utils";
import Descriptions from "../Descriptions";
import { last } from "lodash-es";
import { isNil } from "lodash-es";
import { useNavCollapsed } from "next-common/context/nav";

export default function DataListItem({
  columns,
  row,
  columnClassNames,
  columnStyles,
  highlighted,
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
        navCollapsed={navCollapsed}
      />

      <MobileContent
        row={row}
        columns={columns}
        columnClassNames={columnClassNames}
        navCollapsed={navCollapsed}
      />
    </div>
  );
}

function DesktopContent({ row, columnClassNames, columnStyles, navCollapsed }) {
  const rowItems = Array.isArray(row) ? row : Object.values(row);

  return (
    <div
      className={cn(
        "datalist-desktop-item w-full flex items-center",
        navCollapsed ? "max-sm:hidden" : "max-md:hidden",
      )}
    >
      {rowItems?.map((item, idx) => (
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

function MobileContent({ row = [], columns, navCollapsed }) {
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
        "datalist-mobile-item space-y-3",
        navCollapsed ? "sm:hidden sm:py-4" : "md:hidden md:py-4",
      )}
    >
      <div>
        <div className="flex grow items-center justify-between">
          {first.value}
          {action && items[actionIdx]?.value}
        </div>
        {hasStatus && (
          <div className="flex justify-end pt-3">{items[statusIdx]?.value}</div>
        )}
      </div>

      <Descriptions bordered={false} items={descriptionItems} />
    </div>
  );
}
