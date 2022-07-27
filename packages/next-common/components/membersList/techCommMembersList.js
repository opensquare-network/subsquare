import styled, { withTheme } from "styled-components";

import Flex from "../styled/flex";
import User from "../user";
import React, { Fragment } from "react";
import Loading from "../loading";
import PrimeAddressMark from "../primeAddressMark";

const Wrapper = styled.div`
  max-width: 932px;
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
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  box-sizing: border-box;
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 24px;

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }

    th.clickable {
      color: ${(props) => props.theme.textSecondary};
      cursor: pointer;
      pointer-events: auto;
    }
  }
`;

const StyledTr = styled.tr``;

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
  padding: 15px 0 15px 0;
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

function MembersList({
  chain,
  category,
  items,
  prime,
  loading = false,
  theme,
}) {
  return (
    <Wrapper>
      <Title>{category}</Title>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>MEMBERS</StyledTh>
          </StyledTr>
          <RowSplitter
            backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
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
                    backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
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

export default withTheme(MembersList);
