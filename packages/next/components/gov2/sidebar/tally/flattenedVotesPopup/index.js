import { useEffect, useState } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "./tab";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import Annotation from "next-common/components/democracy/flattenedVotesPopup/annotation";
import SearchBar from "next-common/components/voteSearch/searchBar";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import filterTabs from "../common/filterTabs";
import voteTabs from "../common/voteTabs";
import AddressUser from "next-common/components/user/addressUser";
import VirtualList from "next-common/components/dataList/virtualList";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  allAbstain,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredAye = useSearchVotes(search, allAye);
  const filteredNay = useSearchVotes(search, allNay);
  const filteredAbstain = useSearchVotes(search, allAbstain);

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
        abstainsCount={filteredAbstain?.length || 0}
      />
      <VotesList items={votes} loading={isLoadingVotes} tab={tabIndex} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading, tab }) {
  const chainSettings = useChainSettings();
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
    const votes = item.votes;

    return [
      <AddressUser
        key={item.account}
        add={item.account}
        noTooltip
        maxWidth={276}
        linkToVotesPage
      />,
      <CapitalListItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
        tab={tab}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
      />,
    ];
  });

  return (
    <>
      <PopupListWrapper>
        <VirtualList
          scrollToFirstRowOnChange
          columns={columns}
          rows={rows}
          loading={loading}
          itemHeight={isMobile ? 113 : 52}
          listHeight={395}
        />
      </PopupListWrapper>

      {!loading && <Annotation isOpenGov />}
    </>
  );
}
