import { cn } from "next-common/utils";
import DataListItem from "../item";
import { FixedSizeList, VariableSizeList } from "react-window";
import { useRef } from "react";
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

  const renderRow = ({ index, style }) => {
    const row = rows[index];
    const isLastRow = index === rows.length - 1;

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
          row={row}
          columnClassNames={columnClassNames}
          columnStyles={columnStyles}
          columns={columns}
          highlighted={highlightedIndexes.includes(index)}
        />
      </div>
    );
  };

  const ListComponent = variableSize ? VariableSizeList : FixedSizeList;
  const listProps = variableSize
    ? {
        itemSize: getItemSize || (() => itemHeight),
      }
    : {
        itemSize: itemHeight,
      };

  return (
    <div
      className={cn(
        "datalist-body group/datalist-body",
        "divide-y divide-neutral300 border-b border-neutral300",
      )}
    >
      <ListComponent
        ref={bodyRef}
        height={listHeight}
        itemCount={rows.length}
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
