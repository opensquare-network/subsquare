import React, { memo } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: start;
  padding-top: 12px;
  padding-bottom: 12px;
  color: ${(props) => props.theme.textPrimary};
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};

  @media (max-width: 768px) {
    display: block;
  }
`;
const Header = styled.div`
  width: 160px;
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
  color: ${(props) => props.theme.textPrimary};
  word-break: break-all;

  a {
    color: ${(props) => props.theme.secondarySapphire500};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

function Row({ row = [] }) {
  if (!row) {
    return null;
  }

  return (
    <Wrapper>
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
