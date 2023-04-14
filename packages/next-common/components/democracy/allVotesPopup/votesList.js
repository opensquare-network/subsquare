import React, { Fragment } from "react";
import { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import ValueDisplay from "../../valueDisplay";
import Loading from "../../loading";

import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import VoteLabel from "./voteLabel";
import Chains from "../../../utils/consts/chains";
import { useChain, useChainSettings } from "../../../context/chain";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import Annotation from "./annotation";

function VotesList({ items, theme, loading = true, tab, isOpenGov = false }) {
  const chain = useChain();
  const node = useChainSettings();

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const symbol = node.voteSymbol || node.symbol;

  return (
    <PopupListWrapper>
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
                        isSplit={item.isSplit}
                        isSplitAbstain={item.isSplitAbstain}
                        tab={tab}
                      />
                    </StyledTd>
                  )}
                  <StyledTd style={{ textAlign: "right" }}>
                    <ValueDisplay
                      value={toPrecision(item.balance, node.decimals)}
                      symbol={symbol}
                      showTooltip={false}
                    />
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
      { !loading && <Annotation isOpenGov={ isOpenGov } /> }
    </PopupListWrapper>
  );
}

export default withTheme(VotesList);
