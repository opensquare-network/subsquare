import React, { Fragment } from "react";
import { withTheme } from "styled-components";
import User from "next-common/components/user";
import Loading from "next-common/components/loading";

import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";

function VotesList({ items, theme, loading = false }) {
  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 176 }}>
              ACCOUNT
            </StyledTh>
            <StyledTh style={{ width: "100%", textAlign: "right" }}>
              VOTES
            </StyledTh>
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
                  <StyledTd style={{ textAlign: "left", width: 176 }}>
                    <User
                      add={item.address}
                      fontSize={14}
                      maxWidth={176}
                      noTooltip={true}
                    />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right" }}>
                    {item.votes}
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
                {loading ? <Loading size={16} /> : "No current votes"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </PopupListWrapper>
  );
}

export default withTheme(VotesList);
