import styled, { withTheme } from "styled-components";
import { Fragment } from "react";
import Loading from "next-common/components/loading";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import AddressUser from "next-common/components/user/addressUser";

const Wrapper = styled.div`
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
      {category && <TitleContainer>{category}</TitleContainer>}
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>MEMBERS</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>RANK</StyledTh>
          </StyledTr>
          <RowSplitter
            backgroundColor={
              theme.isDark ? "var(--neutral300)" : "var(--neutral200)"
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
                      <AddressUser add={item.address} />
                    </Member>
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right" }}>
                    {item.rank}
                  </StyledTd>
                </StyledTr>
                {index !== items.length - 1 && (
                  <RowSplitter
                    backgroundColor={
                      theme.isDark ? "var(--neutral300)" : "var(--neutral200)"
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
