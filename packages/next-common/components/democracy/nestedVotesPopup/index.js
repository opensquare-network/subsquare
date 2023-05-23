"use client";

import React, { useState } from "react";
import noop from "lodash.noop";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import Pagination from "next-common/components/pagination";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import Flex from "next-common/components/styled/flex";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import NestedPopupDelegatedDetailPopup from "next-common/components/popup/nestedVotesPopup/delegatedDetail";

export default function NestedVotesPopup({
  setShowVoteList = noop,
  allAye,
  allNay,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  let page = 1;
  let votes = [];
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
    <BaseVotesPopup title="Nested Votes" onClose={() => setShowVoteList(false)}>
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

function VotesList({ items = [], loading }) {
  console.log(items);
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState();

  const columns = [
    {
      name: "ADDRESS",
      style: { minWidth: 376, textAlign: "left" },
    },
    {
      name: "DELEGATORS",
      style: { minWidth: 128, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
    {
      name: "",
      style: { textAlign: "right", width: 40, minWidth: 40 },
    },
  ];

  const rows = items.map((item) => {
    // NOTE: #2866, nested votes
    const votes = item.balance * item.conviction || item.balance;

    const row = [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={326}
      />,
      item.directVoterDelegations?.length,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
        showTooltip={false}
      />,
      <Flex key="enter" style={{ padding: "0 0 0 24px" }}>
        <EnterSVG />
      </Flex>,
    ];

    row.onClick = () => {
      setDetailData(item);
      setShowDetail(true);
    };

    return row;
  });

  return (
    <>
      <PopupListWrapper>
        <StyledList columns={columns} rows={rows} loading={loading} />
      </PopupListWrapper>

      {showDetail && (
        <NestedPopupDelegatedDetailPopup
          data={detailData}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
