import React, { Fragment } from "react";
import styled, { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import Loading from "next-common/components/loading";

import {
  EmptyTd,
  RowSpliter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/displayValue";
import VoteLabel from "next-common/components/democracy/votesPopup/voteLabel";
import SubScanLink from "next-common/components/links/subscanLink";
import dayjs from "dayjs";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
  table {
    border: none;
    padding: 0;
    tbody {
      display: block;
      max-height: 400px;

      ${pretty_scroll_bar};
    }
    thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    box-shadow: none;
  }
`;

const VoteInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const VoteInfoValue = styled.div`
  display: flex;
  gap: 4px;
  justify-content: right;
`;

const VoteTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #9da9bb;
  :hover {
    text-decoration: underline;
  }
`;

function VoteInfo({ item }) {
  const node = useChainSettings();

  return (
    <VoteInfoWrapper>
      <VoteInfoValue>
        <VoteLabel conviction={item.vote.vote.conviction} />
        <ValueDisplay
          value={toPrecision(item.vote.balance, node.decimals)}
          symbol={node.symbol}
        />
      </VoteInfoValue>
      <VoteTime>
        <SubScanLink indexer={item.indexer}>
          {dayjs(item.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
        </SubScanLink>
      </VoteTime>
    </VoteInfoWrapper>
  );
}

function VoteExtrinsicsList({ items, theme, loading = true }) {
  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 176 }}>
              VOTERS
            </StyledTh>
            <StyledTh style={{ textAlign: "right", width: "100%" }}>
              VALUE
            </StyledTh>
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
                  <StyledTd style={{ textAlign: "left", width: 176 }}>
                    <User
                      add={item.voter}
                      fontSize={14}
                      maxWidth={132}
                      noTooltip={true}
                    />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right" }}>
                    <VoteInfo item={item} />
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
                {loading ? <Loading size={16} /> : "No current votes"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
}

export default withTheme(VoteExtrinsicsList);
