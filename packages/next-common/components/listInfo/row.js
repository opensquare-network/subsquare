import React, { memo } from "react";
import styled, { css } from "styled-components";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: start;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef4;
  background-color: white;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: #ffffff;
      background: #212433;
      border-color: #272a3a;
      * {
        color: #ffffff;
      }
    `};
`;
const Header = styled.div`
  width: 120px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #1e2134;
  word-break: break-all;

  a {
    color: #1f70c7;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Row({ row = [] }) {
  if (!row) {
    return null;
  }
  const [theme] = useDarkMode();

  return (
    <Wrapper theme={theme}>
      {row.length === 1 && row[0]}
      {row.length === 2 && (
        <>
          <Header>{row[0]}</Header>
          <Content>{row[1]}</Content>
        </>
      )}
    </Wrapper>
  );
}

export default memo(Row);
