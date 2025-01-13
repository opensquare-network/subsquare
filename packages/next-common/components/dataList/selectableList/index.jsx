import { cn } from "next-common/utils";
import { useDeepCompareEffect, useUpdateEffect } from "react-use";
import { useEffect, useRef, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { isNil } from "lodash-es";
import Checkbox from "next-common/components/checkbox";
import SelectableListBody from "./body";

export default function SelectableList({
  columns = [],
  rows = [],
  loading = false,
  scrollToFirstRowOnChange = false,
  className = "",
  noDataText = "No data",
  bordered = false,
  highlightedIndexes = [],
  selectedRows,
  setSelectedRows,
}) {
  const listRef = useRef();
  const bodyRef = useRef();
  const [navCollapsed] = useNavCollapsed();

  const [listOverflow, setListOverflow] = useState(false);
  const screenSize = useScreenSize();

  // Toggle single row selection
  const toggleRowSelection = (rowKey) => {
    setSelectedRows((prev) =>
      prev.includes(rowKey)
        ? prev.filter((key) => key !== rowKey)
        : [...prev, rowKey],
    );
  };

  // Toggle all rows selection
  const toggleAllSelection = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_, idx) => idx));
    }
  };

  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;

  function handleListOverflowSize() {
    const parentEl = listRef.current?.parentElement;
    const listEl = listRef.current;
    if (!parentEl || !listEl) {
      return;
    }

    const parentWidth = parentEl?.clientWidth;
    const listWidth = listEl?.scrollWidth;

    if (listWidth > parentWidth) {
      setListOverflow(true);
    }
  }
  useUpdateEffect(handleListOverflowSize, [screenSize, navCollapsed]);
  useEffect(handleListOverflowSize, [listRef]);

  useDeepCompareEffect(() => {
    if (scrollToFirstRowOnChange) {
      if (bodyRef.current) {
        bodyRef.current?.scrollTo(0, 0);
      }
    }
  }, [rows]);

  const columnClassNames = columns.map((column) =>
    cn(
      "text14Medium",
      // if there is no width specific, make it flex
      !column.className
        ?.split(" ")
        ?.some((className) => className.startsWith("w-")) &&
        !column?.style?.width &&
        !column?.width &&
        "flex-1 w-full",
      column.className,
    ),
  );
  const columnStyles = columns.map((column) => {
    return {
      ...column.style,
      ...(!isNil(column.width)
        ? {
            width: column.width,
            minWidth: column.width,
          }
        : {}),
    };
  });

  return (
    <div
      className={cn(
        "w-full",
        "scrollbar-hidden",
        "overflow-auto",
        "text-textPrimary",
        "bg-neutral100",
        bordered &&
          cn("p-6", "border border-neutral300 shadow-100", "rounded-xl"),
        className,
      )}
    >
      <div
        ref={listRef}
        role="list"
        className={cn("datalist", "w-full", listOverflow && "min-w-min")}
      >
        <div
          className={cn(
            "datalist-head",
            "flex items-center pb-3",
            "border-b border-neutral300",
          )}
        >
          {columns.map((column, idx) => (
            <div
              key={idx}
              className={cn(
                "text-textTertiary",
                column.headClassName,
                columnClassNames[idx],
              )}
              style={columnStyles[idx]}
            >
              {column.name}
            </div>
          ))}
          {/* check all */}
          <Checkbox
            checked={isAllSelected}
            onClick={toggleAllSelection}
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        <SelectableListBody
          loading={loading}
          rows={rows}
          columns={columns}
          noDataText={noDataText}
          highlightedIndexes={highlightedIndexes}
          navCollapsed={navCollapsed}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
        />
      </div>
    </div>
  );
}

export function MapSelectableList({ data, columnsDef, getRowKey, ...props }) {
  const rows = (data || []).map((item, index) => {
    const row = columnsDef.map(({ render }) => render(item));
    row.key = getRowKey ? getRowKey(item) : index;
    return row;
  });

  return <SelectableList columns={columnsDef} rows={rows} {...props} />;
}
