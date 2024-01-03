import findLastIndex from "lodash.findlastindex";
import { cn } from "next-common/utils";
import Descriptions from "../Descriptions";

export default function DataListItem({ columns, row, columnClassNames }) {
  const { onClick, useData } = row ?? {};

  const data = useData?.();

  return (
    <div
      role="listitem"
      className={cn(
        "max-w-full w-full",
        "flex items-center py-4",
        "max-sm:block",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <DesktopContent
        data={data}
        row={row}
        columns={columns}
        columnClassNames={columnClassNames}
      />

      <MobileContent
        data={data}
        row={row}
        columns={columns}
        columnClassNames={columnClassNames}
      />
    </div>
  );
}

function DesktopContent({ data, row, columns, columnClassNames }) {
  return (
    <div className="max-sm:hidden w-full flex items-center gap-x-4">
      {(data ?? row)?.map((item, idx) => (
        <div
          key={idx}
          style={columns[idx].style}
          className={columnClassNames[idx]}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function MobileContent({ row = [], data, columns }) {
  const items = columns.map((col, idx) => {
    return {
      name: col.name,
      value: data?.[idx] || row?.[idx],
    };
  });

  const actionIdx = findLastIndex(items, (item) => item.name === "");
  const statusIdx = findLastIndex(
    items,
    (item) => item.name?.toLowerCase() === "status",
  );
  const action = items[actionIdx];
  const restItems = items.filter(
    (_, idx) => ![actionIdx, statusIdx].includes(idx),
  );

  const [first, ...rest] = restItems;

  const descriptionItems = rest
    .map((item) => {
      return (
        item && {
          label: <span className="text-textTertiary">{item.name}</span>,
          value: item.value,
          className: "h-auto mt-2 items-start",
        }
      );
    })
    .filter(Boolean);

  return (
    <div className="sm:hidden sm:py-4 space-y-3">
      <div>
        <div className="flex items-center justify-between">
          {first.value}
          {action && items[actionIdx]?.value}
        </div>
        {statusIdx && (
          <div className="flex justify-end pt-3">{items[statusIdx]?.value}</div>
        )}
      </div>

      <Descriptions bordered={false} items={descriptionItems} />
    </div>
  );
}
