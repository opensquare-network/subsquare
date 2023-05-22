import React, { useState } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ExplorerLink from "next-common/components/links/explorerLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import styled from "styled-components";
import { text_tertiary } from "next-common/styles/tailwindcss";
import { toPrecision } from "next-common/utils";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import { useChainSettings } from "next-common/context/chain";

const VoteTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  ${text_tertiary};
  :hover {
    text-decoration: underline;
  }
`;

export default function CallsVotesPopup({
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
    <BaseVotesPopup title="Calls" onClose={() => setShowVoteList(false)}>
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
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const chainSettings = useChainSettings();

  const columns = [
    {
      name: "VOTERS",
      style: { minWidth: 344, textAlign: "left" },
    },
    {
      name: "DATE",
      style: { minWidth: 160, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 168, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const row = [
      <User key="user" add={item.voter} fontSize={14} noTooltip={true} />,
      <VoteTime key="date">
        <ExplorerLink indexer={item.indexer}>
          {formatTime(item.indexer.blockTime)}
        </ExplorerLink>
      </VoteTime>,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(item.vote.balance, chainSettings.decimals)}
        conviction={item.vote.vote.conviction}
      />,
    ];

    return row;
  });

  return (
    <PopupListWrapper>
      <StyledList loading={loading} columns={columns} rows={rows} />
    </PopupListWrapper>
  );
}
