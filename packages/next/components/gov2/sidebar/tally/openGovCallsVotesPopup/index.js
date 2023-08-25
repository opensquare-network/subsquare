import React, { useMemo, useState } from "react";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import { isLoadingVoteCallsSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ExplorerLink from "next-common/components/links/explorerLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import useOpenGovFetchVoteCalls from "./useOpenGovFetchVoteCalls";
import useSearchIdentityAddress from "next-common/hooks/useSearchIdentityAddress";
import SearchBar from "../common/searchBar";
import SearchBtn from "../common/searchBtn";

const VoteTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--textTertiary);
  :hover {
    text-decoration: underline;
  }
`;

export default function OpenGovCallsVotesPopup({ setShowVoteList }) {
  const { referendumIndex } = useOnchainData();
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useOpenGovFetchVoteCalls(referendumIndex);
  const isLoading = useSelector(isLoadingVoteCallsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const [abstainPage, setAbstainPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const pageSize = 50;

  let page;
  let votes;
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = allAye;
  } else if (tabIndex === "Nay") {
    page = nayPage;
    votes = allNay;
  } else {
    page = abstainPage;
    votes = allAbstain;
  }

  const voteAccounts = useMemo(() => votes.map((vote) => vote.voter), [votes]);

  const searchAddresses = useSearchIdentityAddress(search, voteAccounts);

  const filteredVotes = useMemo(() => {
    if (search) {
      return votes.filter(
        (item) =>
          item.voter.includes(search) || searchAddresses.includes(item.voter),
      );
    }
    return votes;
  }, [votes, search, searchAddresses]);

  const onPageChange = (e, target) => {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else if (tabIndex === "Nay") {
      setNayPage(target);
    } else if (tabIndex === "Abstain") {
      setAbstainPage(target);
    }
  };

  const pagination = {
    page,
    pageSize,
    total: filteredVotes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return filteredVotes.slice(sliceFrom, sliceTo);
  }, [filteredVotes, sliceFrom, sliceTo]);

  const searchBtn = (
    <SearchBtn
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      setSearch={setSearch}
    />
  );

  return (
    <BaseVotesPopup
      wide
      title="Calls"
      onClose={() => setShowVoteList(false)}
      extra={searchBtn}
    >
      {showSearch && <SearchBar setSearch={setSearch} />}

      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainCount={allAbstain?.length || 0}
      />
      <VotesList items={items} loading={isLoading} />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const chainSettings = useChainSettings();

  const columns = [
    {
      name: "VOTES",
      style: { minWidth: 264, textAlign: "left" },
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
      <User
        key="user"
        add={item.voter}
        fontSize={14}
        noTooltip={true}
        maxWidth={264}
        linkToVotesPage
      />,
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
      <StyledList
        items={items}
        loading={loading}
        columns={columns}
        rows={rows}
      />
    </PopupListWrapper>
  );
}
