import React, { Fragment, useMemo } from "react";
import styled, { withTheme } from "styled-components";
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
import { useChainSettings } from "next-common/context/chain";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Flex from "next-common/components/styled/flex";
import { convictionToLockX } from "next-common/utils/referendumCommon";

const ConvictionText = styled.span`
  width: 40px;
  color: ${p => p.theme.textTertiary};
`;

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
      <StyledTd style={{ textAlign: "right", width: colWidths.capital }}>
        <Flex style={{ justifyContent: "right" }}>
          <ValueDisplay
            value={toPrecision(item.balance, node.decimals)}
            symbol={symbol}
            showTooltip={false}
          />
          <ConvictionText>{convictionToLockX(item.conviction)}</ConvictionText>
        </Flex>
      </StyledTd>
      <StyledTd style={{ textAlign: "right", width: colWidths.votes }}>
        <ValueDisplay
          value={toPrecision(item.votes, node.decimals)}
          symbol={symbol}
          showTooltip={false}
        />
      </StyledTd>
    </StyledTr>
  );
}

function Rows({ items, colWidths, theme, loading }) {
  if (!loading && items?.length > 0) {
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
      capital: 168,
      votes: 128,
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
            <StyledTh style={{ textAlign: "right", width: colWidths.capital }}>CAPITAL</StyledTh>
            <StyledTh style={{ textAlign: "right", width: colWidths.votes }}>VOTES</StyledTh>
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
