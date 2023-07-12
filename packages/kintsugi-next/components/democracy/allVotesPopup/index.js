"use client";

import VotesTab, { tabs, } from "next-common/components/democracy/flattenedVotesPopup/tab";
import Pagination from "next-common/components/pagination";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  allAyeSelector,
  allNaySelector,
  showVotesNumberSelector
} from "next-common/store/reducers/democracy/votes/selectors";

export default function CheckAllVotesPopup({
  setShowVoteList = () => {},
}) {
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector)

  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  let page;
  let votes;
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = allAye;
  } else {
    page = nayPage;
    votes = allNay;
  }

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else {
      setNayPage(target);
    }
  }

  const pagination = {
    page,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return votes.slice(sliceFrom, sliceTo);
  }, [votes, sliceFrom, sliceTo]);

  return (
    <Popup title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />

      <VotesList items={items} loading={!showVotesNumber} />

      <Pagination {...pagination} />
    </Popup>
  );
}

function VotesList({ items = [], loading }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "VOTERS",
      style: { width: 176, textAlign: "left" },
    },
    {
      name: "VOTES",
      style: { width: 168, textAlign: "right" },
    },
  ];

  const rows = items?.map?.((item) => {
    const row = [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={176}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(item.balance, chainSettings.decimals)}
        symbol={symbol}
      />,
    ];

    return row;
  });

  return (
    <PopupListWrapper>
      <StyledList rows={rows} columns={columns} loading={loading} />
    </PopupListWrapper>
  );
}
