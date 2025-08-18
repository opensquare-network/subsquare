import { useEffect, useState, memo, useMemo } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import Flex from "next-common/components/styled/flex";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import SearchBar from "next-common/components/voteSearch/searchBar";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import voteTabs from "../common/voteTabs";
import filterTabs from "../common/filterTabs";
import AccountCell from "./accountCell";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { isEqual } from "lodash-es";
import usePopupItemHeight from "next-common/components/democracy/democracyCallsVotesPopup/usePopupItemHeight";
import VirtualList from "next-common/components/dataList/virtualList";
import DelayLoaderContent from "next-common/components/delayLoaderContent";
import VoteBarCell, { useMaxTotalVotes } from "../common/voteBarCell";

const NestedPopupDelegatedDetailPopup = dynamicPopup(() =>
  import("next-common/components/popup/nestedVotesPopup/delegatedDetail"),
);

export default function NestedVotesPopup({
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

  const allVotes = useMemo(() => {
    if (tabIndex === voteTabs.Aye) {
      return allAye;
    } else if (tabIndex === voteTabs.Nay) {
      return allNay;
    } else {
      return allAbstain;
    }
  }, [tabIndex, allAye, allNay, allAbstain]);

  const maxTotalVotes = useMaxTotalVotes(allVotes);

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
      setCachedVotesLoading(false);
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
    <>
      <BaseVotesPopup
        title="Nested View"
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
          tabIndex={tabIndex}
          maxTotalVotes={maxTotalVotes}
        />
      </BaseVotesPopup>
    </>
  );
}

function CachedVotesList({ items, loading, tabIndex, maxTotalVotes }) {
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState();

  return (
    <>
      <VotesListView
        items={items}
        loading={loading}
        setShowDetail={setShowDetail}
        setDetailData={setDetailData}
        tabIndex={tabIndex}
        maxTotalVotes={maxTotalVotes}
      />

      {showDetail && (
        <NestedPopupDelegatedDetailPopup
          data={detailData}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

const VotesList = memo(CachedVotesList);

const VotesListView = memo(CachedVotesListView);

function CachedVotesListView({
  items,
  loading,
  setDetailData,
  setShowDetail,
  tabIndex,
  maxTotalVotes,
}) {
  const itemHeight = usePopupItemHeight();

  const columns = useMemo(() => {
    return [
      {
        name: "ACCOUNT",
      },
      {
        name: "DELEGATORS",
        className: "w-[128px] text-right",
      },
      {
        name: "VOTES",
        className: "w-[170px] text-right",
      },
      {
        name: "",
        className: "w-[30px] text-right",
      },
    ];
  }, []);

  const rows = useMemo(() => {
    return items.map((item) => {
      const row = [
        <DelayLoaderContent key={item.account}>
          <AccountCell item={item} />
        </DelayLoaderContent>,
        (item.directVoterDelegations || []).length,
        <VoteBarCell
          votes={item.totalVotes}
          maxTotalVotes={maxTotalVotes}
          voteType={tabIndex}
          key={item?.account}
        />,
        <Flex key="enter" style={{ padding: "0 0 0 14px" }}>
          <EnterSVG />
        </Flex>,
      ];

      row.onClick = () => {
        setDetailData(item);
        setShowDetail(true);
      };

      return row;
    });
  }, [items, maxTotalVotes, tabIndex, setDetailData, setShowDetail]);

  return (
    <PopupListWrapper>
      <VirtualList
        columns={columns}
        rows={rows}
        loading={loading}
        scrollToFirstRowOnChange
        itemHeight={itemHeight}
        listHeight={395}
        overscanCount={3}
      />
    </PopupListWrapper>
  );
}
