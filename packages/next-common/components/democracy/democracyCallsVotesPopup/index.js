import { useEffect, useMemo, useState } from "react";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import { isLoadingVoteCallsSelector } from "next-common/store/reducers/democracy/voteCalls";
import Pagination from "next-common/components/pagination";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import ExplorerLink from "next-common/components/links/explorerLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData, usePost } from "next-common/context/post";
import useDemocracyFetchVoteCalls from "./useDemocracyFetchVoteCalls";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";
import filterTabs from "next-common/components/democracy/common/filterTabs";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BaseVotesPopup = dynamicPopup(() =>
  import("next-common/components/popup/baseVotesPopup"),
);

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

const getVoter = (vote) => vote.voter;

export default function DemocracyCallsVotesPopup({ setShowVoteList }) {
  const { referendumIndex } = useOnchainData();
  const { allAye = [], allNay = [] } =
    useDemocracyFetchVoteCalls(referendumIndex);
  const isLoading = useSelector(isLoadingVoteCallsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const filteredAye = useSearchVotes(search, allAye, getVoter);
  const filteredNay = useSearchVotes(search, allNay, getVoter);

  useEffect(() => {
    const tabs = filterTabs(filteredAye, filteredNay);
    if (!search || tabs.length <= 0 || tabs.includes(tabIndex)) {
      return;
    }

    setTabIndex(tabs[0]);
  }, [filteredAye, filteredNay, search, tabIndex]);

  let page;
  let votes;
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = filteredAye;
  } else if (tabIndex === "Nay") {
    page = nayPage;
    votes = filteredNay;
  }

  const onPageChange = (e, target) => {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else if (tabIndex === "Nay") {
      setNayPage(target);
    }
  };

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
        ayesCount={filteredAye?.length || 0}
        naysCount={filteredNay?.length || 0}
      />
      <VotesList items={items} loading={isLoading} />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const post = usePost();
  const chainSettings = useChainSettings(post.indexer?.blockHeight);

  const columns = [
    {
      name: "VOTES",
      style: { minWidth: 240, textAlign: "left" },
    },
    {
      name: "DATE",
      style: { width: 160, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { width: 160, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const row = [
      <AddressUser
        key="user"
        add={item.voter}
        noTooltip
        maxWidth={264}
        linkToVotesPage
      />,
      <VoteTime key="date">
        <ExplorerLink indexer={item.indexer}>
          {formatTime(item.indexer.blockTime)}
        </ExplorerLink>
      </VoteTime>,
      <CapitalListItem
        key="capital"
        item={item}
        capital={toPrecision(item.vote.balance, chainSettings.decimals)}
        conviction={item.vote.vote?.conviction}
      />,
    ];

    return row;
  });

  return (
    <PopupListWrapper>
      <DataList
        scrollToFirstRowOnChange
        loading={loading}
        columns={columns}
        rows={rows}
      />
    </PopupListWrapper>
  );
}
