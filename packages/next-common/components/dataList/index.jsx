import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import NoData from "../noData";
import DataListItem from "./item";
import { useDeepCompareEffect, useUpdateEffect } from "react-use";
import { useEffect, useRef, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

export default function DataList({
  columns = [],
  rows = [],
  loading = false,
  scrollToFirstRowOnChange = false,
  className = "",
  noDataText = "No current votes",
  bordered = false,
  highlightedIndexes = [],
  showBottomDivider,
}) {
  let content;
  const listRef = useRef();
  const bodyRef = useRef();
  const [navCollapsed] = useNavCollapsed();

  const [listOverflow, setListOverflow] = useState(false);
  const screenSize = useScreenSize();
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
      // if has no width specific, make it flex
      !column.className
        ?.split(" ")
        ?.some((className) => className.startsWith("w-")) &&
        !column?.style?.width &&
        "flex-1 w-full",
      column.className,
    ),
  );
  const columnStyles = columns.map((column) => column.style);

  if (loading) {
    content = (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  } else if (!rows.length) {
    content = <NoData showIcon={false} text={noDataText} />;
  } else {
    content = (
      <div className="divide-y divide-neutral300">
        {rows.map((row, idx) => (
          <DataListItem
            key={idx}
            row={row}
            columnClassNames={columnClassNames}
            columnStyles={columnStyles}
            columns={columns}
            highlighted={highlightedIndexes.includes(idx)}
          />
        ))}
        {showBottomDivider && <div />}
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      role="list"
      className={cn(
        "datalist",
        "w-full",
        listOverflow && "min-w-min",
        "scrollbar-pretty",
        "text-textPrimary",
        "bg-neutral100",
        bordered &&
          cn("p-6", "border border-neutral300 shadow-100", "rounded-xl"),
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center pb-3",
          "border-b border-neutral300",
          "max-sm:hidden",
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

      <div ref={bodyRef} className={cn("datalist-body", "scrollbar-pretty")}>
        {content}
      </div>
    </div>
  );
}
