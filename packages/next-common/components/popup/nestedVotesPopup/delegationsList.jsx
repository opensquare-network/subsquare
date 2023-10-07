"use client";

import React, { useMemo, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import styled, { css } from "styled-components";
import ValueDisplay from "next-common/components/valueDisplay";
import Pagination from "next-common/components/pagination";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import { toPrecision } from "next-common/utils";
import { smcss } from "next-common/utils/responsive";
import { p_14_bold } from "next-common/styles/componentCss";
import AddressUser from "next-common/components/user/addressUser";

const StyledPopupListWrapper = styled(PopupListWrapper)`
  ${smcss(css`
    table tbody {
      max-height: 180px;
    }
  `)}

  /* for non-full screen display */
  @media (height < 750px) {
    table tbody {
      max-height: 80px;
    }
  }
`;

const DelegationListTitle = styled.h3`
  margin: 0;
  margin-bottom: 8px;
  ${p_14_bold};
  color: var(--textPrimary);
`;

export default function DelegationsList({ delegations }) {
  const [detailListPage, setDetailListPage] = useState(1);

  const pageSize = 30;
  function onPageChange(e, newPage) {
    e.preventDefault();
    setDetailListPage(newPage);
  }
  const pagination = {
    page: detailListPage,
    pageSize,
    total: delegations?.length || 0,
    onPageChange,
  };
  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return delegations.slice(sliceFrom, sliceTo);
  }, [delegations, sliceFrom, sliceTo]);

  if (!delegations || delegations.length === 0) {
    return null;
  }

  return (
    <>
      <DelegationListTitle>Delegation List</DelegationListTitle>
      <DetailDelegatorList items={items} />
      <Pagination {...pagination} />
    </>
  );
}

function DetailDelegatorList({ items = [] }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "DELEGATOR",
      style: { minWidth: 296, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 168, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const capital = item.balance;

    const row = [
      <AddressUser
        key="user"
        add={item.account}
        noTooltip
        maxWidth={296}
        linkToVotesPage
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(item.votes, chainSettings.decimals)}
        symbol={symbol}
      />,
    ];

    return row;
  });

  return (
    <StyledPopupListWrapper>
      <StyledList items={items} columns={columns} rows={rows} />
    </StyledPopupListWrapper>
  );
}
