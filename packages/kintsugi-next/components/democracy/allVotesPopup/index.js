"use client";

import VotesTab, {
  tabs,
} from "next-common/components/democracy/flattenedVotesPopup/tab";
import Pagination from "next-common/components/pagination";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  allAyeSelector,
  allNaySelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";

export default function CheckAllVotesPopup({ setShowVoteList = () => {} }) {
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);

  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const filteredAye = useSearchVotes(search, allAye);
  const filteredNay = useSearchVotes(search, allNay);

  let page;
  let votes;
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = filteredAye;
  } else {
    page = nayPage;
    votes = filteredNay;
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

  const searchBtn = (
    <SearchBtn
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      setSearch={setSearch}
    />
  );

  return (
    <Popup
      title="All Votes"
      onClose={() => setShowVoteList(false)}
      extra={searchBtn}
    >
      {showSearch && <SearchBar setSearch={setSearch} />}

      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={filteredAye?.length || 0}
        naysCount={filteredNay?.length || 0}
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
      name: "ACCOUNT",
    },
    {
      name: "VOTES",
      style: { width: 168, textAlign: "right" },
    },
  ];

  const rows = items?.map?.((item) => {
    const row = [
      <AddressUser key="user" add={item.account} noTooltip link="/votes" />,
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
      <DataList rows={rows} columns={columns} loading={loading} />
    </PopupListWrapper>
  );
}
