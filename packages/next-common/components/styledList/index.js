import React from "react";
import { withTheme } from "styled-components";
import Loading from "next-common/components/loading";
import { EmptyTd, StyledTable } from "./styled";
import { Headers } from "./headers";
import DataRows from "./dataRows";
import { StyledTr } from "../styled/table";

function EmptyOrLoading({ loading }) {
  return (
    <tr className="empty-tr">
      <EmptyTd colSpan="100%">
        {loading ? <Loading size={16} /> : "No current members"}
      </EmptyTd>
    </tr>
  );
}

function StyledList({ columns = [], rows = [], loading = false }) {
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

  return (
    <StyledTable>
      <Headers columns={columns} />
      <tbody>{tableBody}</tbody>
    </StyledTable>
  );
}

export default withTheme(StyledList);
