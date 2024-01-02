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
    <div className="max-sm:hidden w-full flex items-center">
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
  const actionColumnIdx = findLastIndex(
    columns,
    (column) => column.name === "",
  );
  const statusColumnIdx = findLastIndex(
    columns,
    (column) => column.name?.toLowerCase() === "status",
  );
  const actionColumn = columns[actionColumnIdx];
  const restColumns = columns.filter(
    (_, idx) => ![actionColumnIdx, statusColumnIdx].includes(idx),
  );
  const restRowItems = (data || row).filter(
    (_, idx) => ![actionColumnIdx, statusColumnIdx].includes(idx),
  );

  const [first, ...rest] = restRowItems;

  const descriptionsLabels = restColumns.slice(1).map((col) => col.name);
  const descriptionItems = rest.filter(Boolean).map((value, idx) => {
    return (
      value && {
        label: (
          <span className="text-textTertiary">{descriptionsLabels[idx]}</span>
        ),
        value,
        className: "h-auto mt-2",
      }
    );
  });

  return (
    <div className="sm:hidden sm:py-4 space-y-3">
      <div>
        <div className="flex items-center justify-between">
          {first}
          {actionColumn && row[actionColumnIdx]}
        </div>
        {statusColumnIdx && (
          <div className="flex justify-end pt-3">{row[statusColumnIdx]}</div>
        )}
      </div>

      <Descriptions bordered={false} items={descriptionItems} />
    </div>
  );
}
