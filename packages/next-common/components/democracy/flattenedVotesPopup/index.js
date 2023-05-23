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

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  isLoadingVotes,
}) {
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
      title="Flattened Votes"
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
        loading={isLoadingVotes}
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
      style: { minWidth: 356, textAlign: "left" },
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
    // NOTE: #2866, flattened capital votes
    const capital = item.balance;
    const votes = capital * item.conviction || item.balance;

    const row = [
      <User key="user" add={item.account} fontSize={14} noTooltip />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
        showTooltip={false}
      />,
    ];

    return row;
  });

  return (
    <>
      <PopupListWrapper>
        <StyledList columns={columns} rows={rows} loading={loading} />
      </PopupListWrapper>

      {!loading && <Annotation />}
    </>
  );
}
