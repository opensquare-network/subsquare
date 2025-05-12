import React, { Fragment } from "react";
import styled, { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import Loading from "next-common/components/loading";

import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import { useChainSettings } from "next-common/context/chain";
import ExplorerLink from "next-common/components/links/explorerLink";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import AddressUser from "next-common/components/user/addressUser";

const VoteTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--textTertiary);
  :hover {
    text-decoration: underline;
  }
`;

function CallsVotesList({ items, theme, loading = false }) {
  const node = useChainSettings();

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 344 }}>
              ACCOUNT
            </StyledTh>
            <StyledTh style={{ textAlign: "left", width: 160 }}>DATE</StyledTh>
            <StyledTh style={{ textAlign: "right", width: 168 }}>
              CAPITAL
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
                  <StyledTd style={{ textAlign: "left", width: 344 }}>
                    <AddressUser add={item.voter} noTooltip />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "left", width: 160 }}>
                    <VoteTime>
                      <ExplorerLink indexer={item.indexer}>
                        {formatTime(item.indexer.blockTime)}
                      </ExplorerLink>
                    </VoteTime>
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right", width: 168 }}>
                    <CapitalListItem
                      item={item}
                      capital={toPrecision(item.vote.balance, node.decimals)}
                      conviction={item.vote.vote.conviction}
                    />
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

export default withTheme(CallsVotesList);
