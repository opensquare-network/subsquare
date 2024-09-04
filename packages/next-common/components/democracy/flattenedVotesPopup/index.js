import { useEffect, useState } from "react";
import VotesTab, { tabs } from "./tab";
import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
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
import useSearchVotes from "next-common/hooks/useSearchVotes";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";
import filterTabs from "next-common/components/democracy/common/filterTabs";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { usePost } from "next-common/context/post";

export default function VotesPopup({ setShowVoteList }) {
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

  const searchBtn = (
    <SearchBtn
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      setSearch={setSearch}
    />
  );

  return (
    <BaseVotesPopup
      title="Flattened View"
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
      <VotesList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={!showVotesNumber}
      />

      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ loading, items = [] }) {
  const post = usePost();
  const chainSettings = useChainSettings(post.indexer?.blockHeight);
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "ACCOUNT",
    },
    {
      name: "CAPITAL",
      className: "w-[188px] text-right",
    },
    {
      name: "VOTES",
      className: "w-[128px] text-right",
    },
  ];

  const rows = items?.map((item) => {
    const capital = item.balance;

    const row = [
      <AddressUser
        key="user"
        add={item.account}
        noTooltip
        maxWidth={276}
        linkToVotesPage
      />,
      <CapitalListItem
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
        <DataList
          scrollToFirstRowOnChange
          columns={columns}
          rows={rows}
          loading={loading}
        />
      </PopupListWrapper>

      {!loading && <Annotation />}
    </>
  );
}
