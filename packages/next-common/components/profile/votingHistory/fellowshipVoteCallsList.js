import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import {
  CallDate,
  FellowshipVoteItem,
  PostTitle,
  ReferendumTag,
} from "./common";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";

export default function FellowshipVoteCallsList({ data, fetchData, page }) {
  const { columns } = useColumns([
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "180px", maxWidth: 384 },
    },
    {
      name: "Date",
      style: { textAlign: "left", width: "200px", minWidth: "200px" },
    },
    {
      name: "Vote",
      style: { textAlign: "left", minWidth: "260px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ]);

  const rows = (data?.items || []).map((item) => [
    <PostTitle
      key="proposal"
      referendumIndex={item.referendumIndex}
      title={item.proposal?.title}
    />,
    <CallDate key="date" vote={item} />,
    <FellowshipVoteItem key="vote" vote={item} />,
    <ReferendumTag key="tag" proposal={item.proposal} />,
  ]);

  return (
    <>
      <ScrollerX>
        <DataList loading={!data} columns={columns} rows={rows} />
      </ScrollerX>
      <Pagination
        {...data}
        page={page}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
