import React from "react";
import { withTheme } from "styled-components";
import Loading from "next-common/components/loading";
import { EmptyTd, StyledTable } from "./styled";
import { Headers } from "./headers";
import DataRows from "./dataRows";

function EmptyOrLoading({ loading }) {
  return (
    <tr>
      <EmptyTd colSpan="100%">
        {loading ? <Loading size={16} /> : "No current members"}
      </EmptyTd>
    </tr>
  );
}

function StyledList({ columns = [], rows = [], loading = false }) {
  let tableBody = null;

  if (!loading) {
    tableBody = <DataRows rows={rows} columns={columns} />;
  } else {
    tableBody = <EmptyOrLoading loading={loading} />;
  }

  return (
    <StyledTable>
      <Headers columns={columns} />
      <tbody>{tableBody}</tbody>
    </StyledTable>
  );
}

export default withTheme(StyledList);
