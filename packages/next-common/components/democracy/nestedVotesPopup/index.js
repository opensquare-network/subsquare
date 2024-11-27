"use client";

import { useEffect, useMemo, useState } from "react";
import { noop } from "lodash-es";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import ValueDisplay from "next-common/components/valueDisplay";
import Flex from "next-common/components/styled/flex";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import { sortTotalVotes } from "../../../utils/democracy/votes/passed/common";
import { useSelector } from "react-redux";
import {
  nestedVotesSelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";
import filterTabs from "../common/filterTabs";
import AddressUser from "next-common/components/user/addressUser";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { usePost } from "next-common/context/post";
import VirtualList from "next-common/components/dataList/virtualList";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";

const NestedPopupDelegatedDetailPopup = dynamicPopup(() =>
  import("next-common/components/popup/nestedVotesPopup/delegatedDetail"),
);

export default function NestedVotesPopup({ setShowVoteList = noop }) {
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const { allAye, allNay } = useSelector(nestedVotesSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);

  const allDirectAyes = useMemo(
    () => sortTotalVotes(allAye.filter((v) => !v.isDelegating)),
    [allAye],
  );
  const allDirectNays = useMemo(
    () => sortTotalVotes(allNay.filter((v) => !v.isDelegating)),
    [allNay],
  );

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const filteredAye = useSearchVotes(search, allDirectAyes);
  const filteredNay = useSearchVotes(search, allDirectNays);

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
      />

      <VotesList items={votes} loading={!showVotesNumber} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const post = usePost();
  const chainSettings = useChainSettings(post.indexer?.blockHeight);
  const isMobile = useIsMobileDevice();
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
      <AddressUser
        key="user"
        add={item.account}
        noTooltip
        maxWidth={296}
        linkToVotesPage
      />,
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
        <VirtualList
          scrollToFirstRowOnChange
          columns={columns}
          rows={rows}
          loading={loading}
          itemHeight={isMobile ? 112 : 52}
          listHeight={395}
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
