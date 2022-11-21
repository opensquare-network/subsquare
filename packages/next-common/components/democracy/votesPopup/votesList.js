import React, { Fragment } from "react";
import styled, { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import ValueDisplay from "../../displayValue";
import Loading from "../../loading";

import {
  EmptyTd,
  RowSpliter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import VoteLabel from "./voteLabel";
import Chains from "../../../utils/consts/chains";
import { pretty_scroll_bar } from "../../../styles/componentCss";
import { useChain, useChainSettings } from "../../../context/chain";
import { pageHomeLayoutMainContentWidth } from "../../../utils/constants";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
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
      overflow-y: auto;
      overflow-x: hidden;

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

function VotesList({ items, theme, loading = true }) {
  const chain = useChain();
  const node = useChainSettings();

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 176 }}>
              VOTERS
            </StyledTh>
            {hasLabel && (
              <StyledTh style={{ textAlign: "center", width: 40 }}>
                LABEL
              </StyledTh>
            )}
            <StyledTh style={{ textAlign: "right" }}>VOTES</StyledTh>
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
                      add={item.account}
                      fontSize={14}
                      maxWidth={132}
                      noTooltip={true}
                    />
                  </StyledTd>
                  {hasLabel && (
                    <StyledTd style={{ textAlign: "center", width: 40 }}>
                      <VoteLabel
                        conviction={item.conviction}
                        isDelegating={item.isDelegating}
                      />
                    </StyledTd>
                  )}
                  <StyledTd style={{ textAlign: "right" }}>
                    <ValueDisplay
                      value={toPrecision(item.balance, node.decimals)}
                      symbol={node.symbol}
                    />
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

export default withTheme(VotesList);
