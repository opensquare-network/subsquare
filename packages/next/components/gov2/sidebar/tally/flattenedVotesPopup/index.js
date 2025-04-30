import { useEffect, useState, memo, useMemo } from "react";
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
import { isEqual } from "lodash-es";
import DataList from "next-common/components/dataList";

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

  const [cachedVotes, setCachedVotes] = useState([]);
  const [cachedVotesLoading, setCachedVotesLoading] = useState(true);
  const [cachedTabIndex, setCachedTabIndex] = useState(tabs[0].tabId);

  const votes = useMemo(() => {
    if (tabIndex === voteTabs.Aye) {
      return filteredAye;
    } else if (tabIndex === voteTabs.Nay) {
      return filteredNay;
    } else {
      return filteredAbstain;
    }
  }, [tabIndex, filteredAye, filteredNay, filteredAbstain]);

  useEffect(() => {
    if (isEqual(cachedVotes, votes) && isEqual(cachedTabIndex, tabIndex)) {
      return;
    }
    setCachedVotesLoading(true);

    setCachedTabIndex(tabIndex);
    setCachedVotes(votes);

    setTimeout(() => {
      setCachedVotesLoading(false);
    }, 500);
  }, [votes, cachedVotes, isLoadingVotes, tabIndex, cachedTabIndex]);

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
        abstainsCount={filteredAbstain?.length || 0}
      />
      <VotesList
        items={cachedVotes}
        loading={cachedVotesLoading}
        tab={tabIndex}
      />
    </BaseVotesPopup>
  );
}

function CachedVotesList({ items = [], loading, tab }) {
  const chainSettings = useChainSettings();
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
        link="/votes"
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
        <DataList
          columns={columns}
          rows={rows}
          loading={loading}
          scrollToFirstRowOnChange
        />
      </PopupListWrapper>

      {!loading && <Annotation isOpenGov />}
    </>
  );
}

const VotesList = memo(CachedVotesList);
