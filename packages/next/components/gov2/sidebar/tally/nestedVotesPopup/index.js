import { useEffect, useState, memo } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import Flex from "next-common/components/styled/flex";
import { toPrecision } from "next-common/utils";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import SearchBar from "next-common/components/voteSearch/searchBar";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import voteTabs from "../common/voteTabs";
import filterTabs from "../common/filterTabs";
import AccountCell from "./accountCell";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { isEqual } from "lodash-es";
import DataList from "next-common/components/dataList";

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

  const [cachedVotes, setCachedVotes] = useState([]);
  const [cachedVotesLoading, setCachedVotesLoading] = useState(true);

  useEffect(() => {
    if (cachedVotesLoading) {
      setCachedVotesLoading(isLoadingVotes);
      setCachedVotes(votes);
    }
    if (isEqual(cachedVotes, votes)) {
      return;
    }

    setCachedVotes(votes);
    setCachedVotesLoading(false);
  }, [votes, cachedVotesLoading, cachedVotes, isLoadingVotes]);

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

        <VotesList items={cachedVotes} loading={cachedVotesLoading} />
      </BaseVotesPopup>
    </>
  );
}

function CachedVotesList({ items, loading }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState();

  const columns = [
    {
      name: "ACCOUNT",
    },
    {
      name: "DELEGATORS",
      className: "w-[128px] text-right",
    },
    {
      name: "VOTES",
      className: "w-[128px] text-right",
    },
    {
      name: "",
      className: "w-10 text-right",
    },
  ];

  const rows = items.map((item) => {
    const row = [
      <AccountCell key={item.account} item={item} />,
      (item.directVoterDelegations || []).length,
      <ValueDisplay
        key="value"
        value={toPrecision(item.totalVotes, chainSettings.decimals)}
        symbol={symbol}
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
        <DataList
          columns={columns}
          rows={rows}
          loading={loading}
          scrollToFirstRowOnChange
        />
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

const VotesList = memo(CachedVotesList);
