import { useEffect, useState } from "react";
import VotesTab, { tabs } from "./tab";
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
import { usePost } from "next-common/context/post";
import VirtualList from "next-common/components/dataList/virtualList";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";

export default function VotesPopup({ setShowVoteList }) {
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  let votes;
  if (tabIndex === "Aye") {
    votes = filteredAye;
  } else {
    votes = filteredNay;
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
      <VotesList items={votes} loading={!showVotesNumber} />
    </BaseVotesPopup>
  );
}

function VotesList({ loading, items = [] }) {
  const post = usePost();
  const chainSettings = useChainSettings(post.indexer?.blockHeight);
  const isMobile = useIsMobileDevice();
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
        link="/votes"
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
        <VirtualList
          scrollToFirstRowOnChange
          columns={columns}
          rows={rows}
          loading={loading}
          itemHeight={isMobile ? 112 : 52}
          listHeight={395}
        />
      </PopupListWrapper>

      {!loading && <Annotation />}
    </>
  );
}
