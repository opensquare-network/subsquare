import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import NoData from "../noData";
import DataListBody, { defaultRenderItem } from "./body";
import { useDeepCompareEffect, useUpdateEffect } from "react-use";
import { useEffect, useRef, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { isNil } from "lodash-es";

export default function DataList({
  columns = [],
  rows = [],
  loading = false,
  scrollToFirstRowOnChange = false,
  className = "",
  noDataText = "No current votes",
  bordered = false,
  highlightedIndexes = [],
  renderItem = defaultRenderItem,
  tree = false,
  treeKey = "children",
  treeData = [],
}) {
  let content;
  const listRef = useRef();
  const bodyRef = useRef();
  const [navCollapsed] = useNavCollapsed();

  const [listOverflow, setListOverflow] = useState(false);
  const screenSize = useScreenSize();
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Toggle row expansion (expand/collapse)
  const toggleRowExpansion = (rowIdx) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(rowIdx)) {
        newExpandedRows.delete(rowIdx);
      } else {
        newExpandedRows.add(rowIdx);
      }
      return newExpandedRows;
    });
  };

  useEffect(() => {
    setExpandedRows(new Set());
  }, [treeData]);

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

  if (loading) {
    content = (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  } else if (!rows.length) {
    content = <NoData showIcon={false} text={noDataText} />;
  } else {
    content = (
      <DataListBody
        rows={rows}
        renderItem={renderItem}
        columnClassNames={columnClassNames}
        columnStyles={columnStyles}
        columns={columns}
        highlightedIndexes={highlightedIndexes}
        tree={tree}
        treeKey={treeKey}
        treeData={treeData}
        expandedRows={expandedRows}
        toggleRowExpansion={toggleRowExpansion}
      />
    );
  }

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
            navCollapsed ? "max-sm:hidden" : "max-md:hidden",
            tree && "pl-[54px]",
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
        </div>

        {content}
      </div>
    </div>
  );
}

export function MapDataList({ data, columnsDef, getRowKey, ...props }) {
  const rows = (data || []).map((item, index) => {
    const row = columnsDef.map(({ render }) => render(item));
    row.key = getRowKey ? getRowKey(item) : index;
    return row;
  });

  return <DataList columns={columnsDef} rows={rows} {...props} />;
}
