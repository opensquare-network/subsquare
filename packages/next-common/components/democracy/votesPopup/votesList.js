import React from "react";
import styled, { withTheme } from "styled-components";
import { getNode, toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import { Fragment } from "react";
import ValueDisplay from "../../displayValue";
import Loading from "../../loading";

import { EmptyTd, RowSpliter, StyledTable, StyledTd, StyledTh, StyledTr, } from "next-common/components/styled/table";
import VoteLabel from "./voteLabel";
import Chains from "../../../utils/consts/chains";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
  max-height: 500px;
  overflow-y: auto;
  table {
    border: none;
    padding: 0;
    thead {
      top: 0;
      background-color: ${(props) => props.theme.neutral};
      border-color: ${(props) => props.theme.neutral};
    }
  }
`;

function VotesList({ chain, items, theme, loading = true }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 176 }}>
              VOTERS
            </StyledTh>
            {
              hasLabel &&
              <StyledTh style={ { textAlign: "center", width: 40 } }>
                LABEL
              </StyledTh>
            }
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
                  <StyledTd style={{ textAlign: "left" }}>
                    <User
                      add={item.account}
                      chain={chain}
                      fontSize={14}
                      maxWidth={132}
                    />
                  </StyledTd>
                  {
                    hasLabel &&
                    <StyledTd style={{ textAlign: "center" }}>
                      <VoteLabel conviction={ item.conviction } isDelegating={ item.isDelegating } />
                    </StyledTd>
                  }
                  <StyledTd style={{ textAlign: "right" }}>
                    <ValueDisplay
                      value={toPrecision(item.balance, node.decimals)}
                      symbol={node.symbol} />
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
