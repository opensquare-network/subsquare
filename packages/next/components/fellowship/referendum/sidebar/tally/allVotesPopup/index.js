import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, {
  tabs,
} from "next-common/components/democracy/flattenedVotesPopup/tab";
import Pagination from "next-common/components/pagination";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { FellowshipRankInfo } from "../eligibleVoters/columns";

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  const votes = tabIndex === tabs[0].tabId ? allAye : allNay;

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else {
      setNayPage(target);
    }
  }

  const pagination = {
    page: tabIndex === "Aye" ? ayePage : nayPage,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Popup title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />
      <VotesList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoadingVotes}
      />
      <Pagination {...pagination} />
    </Popup>
  );
}

function VotesList({ items = [], loading }) {
  const columns = [
    { name: "", style: { width: 40, textAlign: "center" } },
    {
      name: "ACCOUNT",
      style: { minWidth: 176, textAlign: "left" },
    },
    {
      name: "VOTES",
      style: { textAlign: "right" },
    },
  ];

  const rows = items.map((item) => {
    const row = [
      <FellowshipRankInfo
        key="rank"
        address={item.address}
        className="min-w-5"
      />,
      <AddressUser
        key="user"
        add={item.address}
        maxWidth={176}
        noTooltip
        link="/votes"
      />,
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
