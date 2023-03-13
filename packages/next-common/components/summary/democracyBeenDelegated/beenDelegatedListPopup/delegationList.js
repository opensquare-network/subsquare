import React, { Fragment, useMemo } from "react";
import { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import Loading from "next-common/components/loading";

import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import Chains from "next-common/utils/consts/chains";
import { useChain, useChainSettings } from "next-common/context/chain";
import { Conviction } from "utils/referendumUtil";
import PopupListWrapper from "../../../styled/popupListWrapper";
import { useScreenSize } from "../../../../utils/hooks/useScreenSize";


function DelegationList({ items, theme, loading = true }) {
  const chain = useChain();
  const node = useChainSettings();

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const symbol = node.voteSymbol || node.symbol;

  const { sm } = useScreenSize();
  const colWidths = useMemo(() => {
    let widths = {
      address: "100%",
      label: 80,
      support: 128,
    };

    if (sm && hasLabel) {
      widths.address = 124;
    }

    return widths;
  }, [sm]);

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: colWidths.address }}>ADDRESS</StyledTh>
            {hasLabel && <StyledTh style={{ textAlign: "right", width: colWidths.label }}>LABEL</StyledTh>}
            <StyledTh style={{ textAlign: "right", width: colWidths.support }}>SUPPORT</StyledTh>
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
                  <StyledTd style={{ textAlign: "left", width: colWidths.address }}>
                    <User
                      add={item.delegator}
                      fontSize={14}
                      maxWidth={colWidths.address-30}
                      noTooltip={true}
                    />
                  </StyledTd>
                  {hasLabel && (
                    <StyledTd style={{ textAlign: "right", width: colWidths.label }}>
                      <VoteLabel
                        conviction={Conviction[item.conviction]}
                        isDelegating={item.isDelegating}
                      />
                    </StyledTd>
                  )}
                  <StyledTd style={{ textAlign: "right", width: colWidths.support }}>
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
                {loading ? <Loading size={16} /> : "No current delegations"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </PopupListWrapper>
  );
}

export default withTheme(DelegationList);
