import { useEffect, useRef, useState } from "react";
import { withTheme } from "styled-components";
import { Headers } from "./headers";
import DataRows from "./dataRows";
import { EmptyTd, StyledTable } from "next-common/components/styled/table";
import { SystemLoading } from "@osn/icons/subsquare";
import { isEqual } from "lodash-es";

function EmptyOrLoading({ loading, noDataText = "" }) {
  return (
    <tr className="empty-tr">
      <EmptyTd colSpan="100%">
        {loading ? (
          <SystemLoading className="w-5 h-5 mx-auto [&_path]:stroke-textDisabled" />
        ) : (
          noDataText
        )}
      </EmptyTd>
    </tr>
  );
}

function StyledList({
  columns = [],
  rows = [],
  loading = false,
  scrollToFirstRowOnChange = true,
  // FIXME: data source, use to scroll to first row
  items = [],
  className = "",
  noDataText = "No current votes",
}) {
  const tableBodyRef = useRef();
  let tableBody;

  if (loading) {
    tableBody = <EmptyOrLoading loading={loading} />;
  } else if (!rows?.length) {
    tableBody = <EmptyOrLoading noDataText={noDataText} />;
  } else {
    tableBody = <DataRows rows={rows} columns={columns} />;
  }

  // use to compare items(data source) changes
  const [compareItems, setCompareItems] = useState([]);
  useEffect(() => {
    if (!isEqual(items, compareItems)) {
      setCompareItems(items);
    }
  }, [items, compareItems]);
  useEffect(() => {
    if (scrollToFirstRowOnChange && compareItems.length) {
      if (tableBodyRef.current) {
        tableBodyRef.current.scrollTo(0, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareItems]);

  return (
    <StyledTable className={className}>
      <Headers columns={columns} />
      <tbody ref={tableBodyRef}>{tableBody}</tbody>
    </StyledTable>
  );
}

export default withTheme(StyledList);
