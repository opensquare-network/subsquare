import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import NoData from "../../noData";
import DataListBody, { defaultRenderItem } from "./body";
import { useUpdateEffect } from "react-use";
import { useEffect, useRef, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { isNil } from "lodash-es";

export default function VirtualList({
  columns = [],
  rows = [],
  loading = false,
  scrollToFirstRowOnChange = false,
  className = "",
  noDataText = "No current votes",
  bordered = false,
  highlightedIndexes = [],
  renderItem = defaultRenderItem,
  itemHeight = 50,
  listHeight = 400,
}) {
  const listRef = useRef();
  const [navCollapsed] = useNavCollapsed();
  const [listOverflow, setListOverflow] = useState(false);
  const screenSize = useScreenSize();

  const handleListOverflowSize = () => {
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
  };

  useUpdateEffect(handleListOverflowSize, [screenSize, navCollapsed]);
  useEffect(handleListOverflowSize, [listRef]);

  const columnClassNames = columns.map((column) =>
    cn(
      "text14Medium",
      !column.className
        ?.split(" ")
        ?.some((className) => className.startsWith("w-")) &&
        !column?.style?.width &&
        !column?.width &&
        "flex-1 w-full",
      column.className,
    ),
  );
  const columnStyles = columns.map((column) => ({
    ...column.style,
    ...(!isNil(column.width)
      ? { width: column.width, minWidth: column.width }
      : {}),
  }));

  const minListHeight = Math.min(rows.length * itemHeight, listHeight);

  const calculatedListHeight =
    rows.length * itemHeight <= listHeight ? minListHeight : listHeight;

  let content;
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
        itemHeight={itemHeight}
        listHeight={calculatedListHeight}
        scrollToFirstRowOnChange={scrollToFirstRowOnChange}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full scrollbar-hidden overflow-auto text-textPrimary bg-neutral100",
        bordered && cn("p-6 border border-neutral300 shadow-100 rounded-xl"),
        className,
      )}
    >
      <div
        ref={listRef}
        role="list"
        className={cn("datalist w-full", listOverflow && "min-w-min")}
      >
        <div
          className={cn(
            "datalist-head flex items-center pb-3 border-b border-neutral300",
            navCollapsed ? "max-sm:hidden" : "max-md:hidden",
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
