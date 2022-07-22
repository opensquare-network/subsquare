import styled, { css } from "styled-components";

import Flex from "../styled/flex";
import User from "../user";
import React, { Fragment } from "react";
import Loading from "../loading";
import PrimeAddressMark from "../primeAddressMark";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = styled.div`
  max-width: 852px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled(Flex)`
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-sizing: border-box;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 24px;

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }

    th.clickable {
      color: #506176;
      cursor: pointer;
      pointer-events: auto;
    }
  }
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: #fff;
    `};
`;

const StyledTr = styled.tr``;

const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: #9da9bb;
  pointer-events: none;
`;

const StyledTd = styled.td`
  padding: 15px 0 15px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: #1e2134;
`;

const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #9da9bb;
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RowSplitter = ({ backgroundColor, padding }) => (
  <tr>
    <td colSpan="3" style={{ padding }}>
      <div style={{ height: "1px", backgroundColor }} />
    </td>
  </tr>
);

export default function MembersList({
  chain,
  category,
  items,
  prime,
  loading = false,
}) {
  const [theme] = useDarkMode();
  return (
    <Wrapper>
      <Title>{category}</Title>
      <StyledTable theme={theme}>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>MEMBERS</StyledTh>
          </StyledTr>
          <RowSplitter
            backgroundColor={theme === "dark" ? "#272A3A" : "#F6F7FA"}
            padding={"16px 0 4px 0"}
          />
        </thead>
        <tbody>
          {items?.length > 0 ? (
            items.map((item, index) => (
              <Fragment key={index}>
                <StyledTr>
                  <StyledTd style={{ textAlign: "left" }}>
                    <Member>
                      <User add={item} chain={chain} fontSize={14} />
                      {item === prime && <PrimeAddressMark />}
                    </Member>
                  </StyledTd>
                </StyledTr>
                {index !== items.length - 1 && (
                  <RowSplitter
                    backgroundColor={theme === "dark" ? "#272A3A" : "#F6F7FA"}
                  />
                )}
              </Fragment>
            ))
          ) : (
            <StyledTr>
              <EmptyTd colSpan="3">
                {loading ? <Loading size={16} /> : "No current members"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
}
