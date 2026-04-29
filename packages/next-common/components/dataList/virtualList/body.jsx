import { cn } from "next-common/utils";
import DataListItem from "../item";
import { FixedSizeList, VariableSizeList } from "react-window";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDeepCompareEffect } from "react-use";

export default function VirtualListBody({
  rows = [],
  columnClassNames = [],
  columnStyles = [],
  columns = [],
  highlightedIndexes = [],
  scrollToFirstRowOnChange,
  itemHeight = 50,
  listHeight = 400,
  overscanCount = 20,
  variableSize = false,
  getItemSize,
}) {
  const bodyRef = useRef();

  useDeepCompareEffect(() => {
    if (scrollToFirstRowOnChange && bodyRef?.current) {
      requestAnimationFrame(() => {
        bodyRef?.current?.scrollTo(0, 0);
      });
    }
  }, [rows, bodyRef]);

  // Must reset VariableSizeList caches item sizes.
  useEffect(() => {
    if (variableSize && bodyRef?.current) {
      bodyRef.current.resetAfterIndex(0);
    }
  }, [rows, variableSize]);

  const ListComponent = variableSize ? VariableSizeList : FixedSizeList;
  const listProps = useMemo(
    () =>
      variableSize
        ? { itemSize: getItemSize || (() => itemHeight) }
        : { itemSize: itemHeight },
    [variableSize, getItemSize, itemHeight],
  );

  const renderRow = useCallback(
    ({ index, style, data }) => {
      const row = data[index];
      const isLastRow = index === data.length - 1;

      return (
        <div
          style={style}
          className={cn(
            "flex items-center",
            !isLastRow && "border-b border-neutral300",
            highlightedIndexes.includes(index) ? "bg-highlight" : "",
          )}
        >
          <DataListItem
            itemClassName="py-0"
            row={row}
            columnClassNames={columnClassNames}
            columnStyles={columnStyles}
            columns={columns}
            highlighted={highlightedIndexes.includes(index)}
          />
        </div>
      );
    },
    [highlightedIndexes, columnClassNames, columnStyles, columns],
  );

  return (
    <div
      className={cn("divide-y divide-neutral300 border-b border-neutral300")}
    >
      <ListComponent
        ref={bodyRef}
        height={listHeight}
        itemCount={rows.length}
        itemData={rows}
        className="scrollbar-pretty"
        width="100%"
        overscanCount={overscanCount}
        {...listProps}
      >
        {renderRow}
      </ListComponent>
    </div>
  );
}
