import React, { useState } from "react";
import VotesTab, { tabs } from "./tab";
import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import Annotation from "./annotation";
import { useSelector } from "react-redux";
import {
  allAyeSelector,
  allNaySelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/democracy/votes/selectors";

export default function VotesPopup({
  setShowVoteList,
}) {
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);
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

  return (
    <BaseVotesPopup
      title="Flattened View"
      onClose={() => setShowVoteList(false)}
    >
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />
      <VotesList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={!showVotesNumber}
      />

      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ loading, items = [] }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "VOTERS",
      style: { minWidth: 276, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 188, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const capital = item.balance;

    const row = [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={276}
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
    <>
      <PopupListWrapper>
        <StyledList
          items={items}
          columns={columns}
          rows={rows}
          loading={loading}
        />
      </PopupListWrapper>

      {!loading && <Annotation />}
    </>
  );
}
