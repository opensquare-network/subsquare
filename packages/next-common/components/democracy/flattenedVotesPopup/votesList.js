import React, { Fragment } from "react";
import { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
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
import AddressUser from "next-common/components/user/addressUser";

function VotesList({ items, theme, loading = false, tab, isOpenGov = false }) {
  const chain = useChain();
  const node = useChainSettings();

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const symbol = node.voteSymbol || node.symbol;

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 416 }}>
              ACCOUNT
            </StyledTh>
            {hasLabel && (
              <StyledTh style={{ textAlign: "right", width: 128 }}>
                LABEL
              </StyledTh>
            )}
            <StyledTh style={{ textAlign: "right", width: 128 }}>
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
                  <StyledTd style={{ textAlign: "left", width: 416 }}>
                    <AddressUser add={item.account} noTooltip />
                  </StyledTd>
                  {hasLabel && (
                    <StyledTd style={{ textAlign: "right", width: 128 }}>
                      <VoteLabel
                        conviction={item.conviction}
                        isDelegating={item.isDelegating}
                        isSplit={item.isSplit}
                        isSplitAbstain={item.isSplitAbstain}
                        tab={tab}
                      />
                    </StyledTd>
                  )}
                  <StyledTd style={{ textAlign: "right", width: 128 }}>
                    <ValueDisplay
                      value={toPrecision(item.balance, node.decimals)}
                      symbol={symbol}
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
      {!loading && <Annotation isOpenGov={isOpenGov} />}
    </PopupListWrapper>
  );
}

export default withTheme(VotesList);
