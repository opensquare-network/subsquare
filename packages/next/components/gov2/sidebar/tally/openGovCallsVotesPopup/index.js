import { useEffect, useState } from "react";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import { isLoadingVoteCallsSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import ExplorerLink from "next-common/components/links/explorerLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import useOpenGovFetchVoteCalls from "./useOpenGovFetchVoteCalls";
import SearchBar from "next-common/components/voteSearch/searchBar";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import filterTabs from "../common/filterTabs";
import voteTabs from "../common/voteTabs";
import AddressUser from "next-common/components/user/addressUser";
import VirtualList from "next-common/components/dataList/virtualList";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";

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

export default function OpenGovCallsVotesPopup({ setShowVoteList }) {
  const { referendumIndex } = useOnchainData();
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useOpenGovFetchVoteCalls(referendumIndex);
  const isLoading = useSelector(isLoadingVoteCallsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredAye = useSearchVotes(search, allAye, getVoter);
  const filteredNay = useSearchVotes(search, allNay, getVoter);
  const filteredAbstain = useSearchVotes(search, allAbstain, getVoter);

  useEffect(() => {
    const tabs = filterTabs(filteredAye, filteredNay, filteredAbstain);
    if (!search || tabs.length <= 0 || tabs.includes(tabIndex)) {
      return;
    }

    setTabIndex(tabs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  let votes;
  if (tabIndex === voteTabs.Aye) {
    votes = filteredAye;
  } else if (tabIndex === voteTabs.Nay) {
    votes = filteredNay;
  } else {
    votes = filteredAbstain;
  }

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
        abstainCount={filteredAbstain?.length || 0}
      />
      <VotesList items={votes} loading={isLoading} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const chainSettings = useChainSettings();
  const isMobile = useIsMobileDevice();

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
    return [
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
        conviction={item.vote.vote.conviction}
      />,
    ];
  });

  return (
    <PopupListWrapper>
      <VirtualList
        scrollToFirstRowOnChange
        loading={loading}
        columns={columns}
        rows={rows}
        itemHeight={isMobile ? 112 : 52}
        listHeight={395}
      />
    </PopupListWrapper>
  );
}
