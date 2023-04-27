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
import { useChainSettings } from "next-common/context/chain";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

function Row({ item, colWidths }) {
  const node = useChainSettings();
  const symbol = node.voteSymbol || node.symbol;

  return (
    <StyledTr>
      <StyledTd style={{ textAlign: "left", width: colWidths.address }}>
        <User
          add={item.account}
          fontSize={14}
          maxWidth={colWidths.address-30}
          noTooltip={true}
        />
      </StyledTd>
      <StyledTd style={{ textAlign: "right", width: colWidths.label }}>
        <VoteLabel
          conviction={item.conviction}
          isDelegating={item.isDelegating}
        />
      </StyledTd>
      <StyledTd style={{ textAlign: "right", width: colWidths.support }}>
        <ValueDisplay
          value={toPrecision(item.balance, node.decimals)}
          symbol={symbol}
          showTooltip={false}
        />
      </StyledTd>
    </StyledTr>
  );
}

function Rows({ items, colWidths, theme, loading }) {
  if (items?.length > 0) {
    return (
      items.map((item, index) => (
        <Fragment key={index}>
          <Row item={item} colWidths={colWidths} />
          {index !== items.length - 1 && (
            <RowSplitter
              backgroundColor={
                theme.isDark ? theme.grey200Border : theme.grey100Bg
              }
            />
          )}
        </Fragment>
      ))
    );
  }

  return (
    <StyledTr>
      <EmptyTd colSpan="100%">
        {loading ? <Loading size={16} /> : "No current delegations"}
      </EmptyTd>
    </StyledTr>
  );
}

function DelegationList({ items, theme, loading = true }) {
  const { sm } = useScreenSize();
  const colWidths = useMemo(() => {
    let widths = {
      address: "100%",
      label: 60,
      support: 100,
    };

    if (sm) {
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
            <StyledTh style={{ textAlign: "right", width: colWidths.label }}>LABEL</StyledTh>
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
          <Rows items={items} colWidths={colWidths} theme={theme} loading={loading} />
        </tbody>
      </StyledTable>
    </PopupListWrapper>
  );
}

export default withTheme(DelegationList);
