import React, { Fragment } from "react";
import styled, { withTheme } from "styled-components";
import { useThemeSetting } from "../../context/theme";
import Loading from "../loading";

const StyledTable = styled.table`
  width: 100%;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  box-sizing: border-box;
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 24px;
`;

const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
  pointer-events: none;
`;

const StyledTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: ${(props) => props.theme.textPrimary};
`;

const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textTertiary};
`;

const RowSplitter = ({ backgroundColor, padding }) => (
  <tr>
    <td colSpan="3" style={{ padding }}>
      <div style={{ height: "1px", backgroundColor }} />
    </td>
  </tr>
);

function EmptyOrLoading({ loading }) {
  return (
    <tr>
      <EmptyTd colSpan="3">
        {loading ? <Loading size={16} /> : "No current members"}
      </EmptyTd>
    </tr>
  );
}

function DataRow({ row, columns }) {
  return (
    <tr>
      {row?.map((val, i) => (
        <StyledTd
          key={i}
          style={columns[i].style}
          className={columns[i].className}
        >
          {val}
        </StyledTd>
      ))}
    </tr>
  );
}

function MemberListTable({ columns = [], rows = [], loading = false }) {
  const theme = useThemeSetting();

  let tableBody = null;

  if (rows?.length > 0) {
    tableBody = rows.map((row, index) => (
      <Fragment key={index}>
        <DataRow row={row} columns={columns} />
        {index !== rows.length - 1 && (
          <RowSplitter backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"} />
        )}
      </Fragment>
    ));
  } else {
    tableBody = <EmptyOrLoading />;
  }

  return (
    <StyledTable>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <StyledTh
              key={index}
              style={col.style}
              className={col.className}
              onClick={col.onClick}
            >
              {col.name}
            </StyledTh>
          ))}
        </tr>
        <RowSplitter
          backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
          padding={"16px 0 4px 0"}
        />
      </thead>
      <tbody>{tableBody}</tbody>
    </StyledTable>
  );
}

export default withTheme(MemberListTable);
