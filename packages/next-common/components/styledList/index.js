import React, { useEffect, useRef } from "react";
import { withTheme } from "styled-components";
import Loading from "next-common/components/loading";
import { Headers } from "./headers";
import DataRows from "./dataRows";
import {
  EmptyTd,
  StyledTable,
  StyledTr,
} from "next-common/components/styled/table";

function EmptyOrLoading({ loading }) {
  return (
    <tr className="empty-tr">
      <EmptyTd colSpan="100%">
        {loading ? <Loading size={16} /> : "No current members"}
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
}) {
  const tableBodyRef = useRef();
  let tableBody = null;

  if (loading) {
    tableBody = <EmptyOrLoading loading={loading} />;
  } else if (!rows?.length) {
    tableBody = (
      <StyledTr>
        <EmptyTd>No current votes</EmptyTd>
      </StyledTr>
    );
  } else {
    tableBody = <DataRows rows={rows} columns={columns} />;
  }

  useEffect(() => {
    if (scrollToFirstRowOnChange) {
      if (tableBodyRef.current) {
        tableBodyRef.current.scrollTo(0, 0);
      }
    }
  }, [items]);

  return (
    <StyledTable>
      <Headers columns={columns} />
      <tbody ref={tableBodyRef}>{tableBody}</tbody>
    </StyledTable>
  );
}

export default withTheme(StyledList);
