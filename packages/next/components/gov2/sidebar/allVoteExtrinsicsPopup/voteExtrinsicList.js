import React, { Fragment } from "react";
import styled, { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
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
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import dayjs from "dayjs";
import ExternalLinks from "next-common/components/links";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";

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
  display: flex;
  justify-content: right;
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
          showTooltip={false}
        />
      </VoteInfoValue>
      <VoteTime>
        <ExternalLinks indexer={item.indexer}>
          {dayjs(item.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
        </ExternalLinks>
      </VoteTime>
    </VoteInfoWrapper>
  );
}

function VoteExtrinsicsList({ items, theme, loading = true }) {
  return (
    <PopupListWrapper>
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
          <RowSplitter
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
                  <RowSplitter
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
    </PopupListWrapper>
  );
}

export default withTheme(VoteExtrinsicsList);
