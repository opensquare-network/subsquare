import {
  EmptyTd,
  StyledTable,
  StyledTr,
} from "next-common/components/styled/table";
import { cn } from "next-common/utils";
import { isFunction } from "lodash-es";
import NoData from "next-common/components/noData";
import Loading from "next-common/components/loading";
import { useMemo, useCallback } from "react";

const getStyle = (color, item, index) => {
  if (isFunction(color)) {
    return color(item, index);
  }
  return color;
};
const getClassName = (className, item, index) => {
  if (isFunction(className)) {
    return className(item, index);
  }
  return className;
};

export default function Table({
  dataSource = [],
  columns = [],
  loading = false,
  rowKey = "id",
  showHeader = true,
  emptyText = "No data found",
  onRow,
  className = "",
  ...props
}) {
  const colSpan = useMemo(() => columns.length || 1, [columns.length]);

  const handleRowClick = useCallback(
    (record, index, event) => {
      if (onRow?.onClick) {
        onRow.onClick(record, index, event);
      }
    },
    [onRow],
  );

  return (
    <StyledTable {...props} className={cn("border-collapse", className)}>
      {showHeader && (
        <thead className="bg-neutral200 border-b border-neutral100">
          <tr>
            {columns.map((column, index) => (
              <td
                key={column.key || column.dataIndex || index}
                style={column.headerStyle}
                className={cn("p-2 py-3 text14Bold", column.headerClassName)}
              >
                {column.title}
              </td>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {dataSource?.length > 0 ? (
          dataSource?.map((item, dataIndex) => (
            <tr
              key={item?.[rowKey] || dataIndex}
              className={cn(
                "hover:bg-neutral200",
                getClassName(onRow?.className, item, dataIndex),
              )}
              onClick={(e) => handleRowClick(item, dataIndex, e)}
              style={getStyle(onRow?.style, item, dataIndex)}
            >
              {columns.map((column, colIndex) => (
                <TableTd
                  key={column.key || column.dataIndex || colIndex}
                  data={item}
                  config={column}
                  index={dataIndex}
                />
              ))}
            </tr>
          ))
        ) : (
          <EmptyOrLoadingBody
            colSpan={colSpan}
            loading={loading}
            emptyText={emptyText}
          />
        )}
      </tbody>
    </StyledTable>
  );
}

function EmptyOrLoadingBody({ colSpan, loading, emptyText }) {
  return (
    <StyledTr>
      <EmptyTd colSpan={colSpan}>
        {loading ? (
          <Loading size={16} />
        ) : (
          <div>
            <NoData text={emptyText} />
          </div>
        )}
      </EmptyTd>
    </StyledTr>
  );
}

function TableTd({ data, config, index }) {
  const cellStyle = useMemo(
    () => getStyle(config.style, data, index),
    [config, data, index],
  );

  // Get cell className (supports function or string)
  const cellClassName = useMemo(
    () => getClassName(config.className, data, index),
    [config, data, index],
  );

  // Get data value from the specified key or dataIndex
  const value = useMemo(() => {
    const key = config.key || config.dataIndex;
    return key ? data?.[key] : undefined;
  }, [config.key, config.dataIndex, data]);

  // Render cell content using custom render function or display value
  const content = useMemo(() => {
    if (config.render) {
      return config.render(value, data, index);
    }
    return value;
  }, [config, value, data, index]);

  return (
    <td
      style={cellStyle}
      className={cn(
        " text14Medium font-normal p-2 border-b border-neutral200",
        cellClassName,
      )}
      onClick={config.onCellClick?.(data, index)}
    >
      {content}
    </td>
  );
}
