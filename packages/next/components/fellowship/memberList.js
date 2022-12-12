import styled, { withTheme } from "styled-components";
import User from "next-common/components/user";
import { Fragment } from "react";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  EmptyTd,
  RowSpliter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import { pageHomeLayoutMainContentWidth } from "next-common/utils/constants";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function MembersList({ category, items, loading = false, theme }) {
  return (
    <Wrapper>
      <TitleContainer>{category}</TitleContainer>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>MEMBERS</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>RANK</StyledTh>
          </StyledTr>
          <RowSpliter
            backgroundColor={
              theme.isDark ? theme.grey200Border : theme.grey100Bg
            }
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
                      <User add={item.address} fontSize={14} />
                    </Member>
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right" }}>
                    {item.rank}
                  </StyledTd>
                </StyledTr>
                {index !== items.length - 1 && (
                  <RowSpliter
                    backgroundColor={
                      theme.isDark ? theme.grey200Border : theme.grey100Bg
                    }
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
