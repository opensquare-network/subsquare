import { useMemo, useState } from "react";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import { isLoadingVoteCallsSelector } from "next-common/store/reducers/fellowship/voteCalls";
import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import ExplorerLink from "next-common/components/links/explorerLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import styled from "styled-components";
import useFellowshipFetchVoteCalls from "./useFellowshipFetchVoteCalls";
import { useOnchainData } from "next-common/context/post";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";

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

export default function FellowshipCallsVotesPopup({ setShowVoteList }) {
  const { referendumIndex } = useOnchainData();
  const { allAye = [], allNay = [] } =
    useFellowshipFetchVoteCalls(referendumIndex);

  const isLoading = useSelector(isLoadingVoteCallsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  let page;
  let votes;
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = allAye;
  } else if (tabIndex === "Nay") {
    page = nayPage;
    votes = allNay;
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

  return (
    <BaseVotesPopup title="Calls" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />
      <VotesList items={items} loading={isLoading} />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading }) {
  const columns = [
    {
      name: "VOTER",
      style: { minWidth: 264, textAlign: "left" },
    },
    {
      name: "DATE",
      style: { minWidth: 160, textAlign: "left" },
    },
    {
      name: "VOTES",
      style: { minWidth: 160, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const row = [
      <AddressUser
        key="user"
        add={item.voter}
        noTooltip
        maxWidth={264}
        link="/votes"
      />,
      <VoteTime key="date">
        <ExplorerLink indexer={item.indexer}>
          {formatTime(item.indexer.blockTime)}
        </ExplorerLink>
      </VoteTime>,
      item.votes,
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
