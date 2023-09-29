import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import {
  CallDate,
  normalizeCall,
  PostTitle,
  ReferendumTag,
  VoteItem,
} from "./common";
import { useChain } from "next-common/context/chain";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";

export default function VoteCallsList({ data, fetchData, page }) {
  const chain = useChain();
  const { columns } = useColumns([
    {
      name: "Proposal",
      style: {
        textAlign: "left",
        minWidth: "180px",
        maxWidth: 384,
        paddingRight: 16,
      },
    },
    { name: "Date", style: { textAlign: "left", minWidth: "200px" } },
    {
      name: "Vote",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
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
    <VoteItem key="vote" vote={normalizeCall(item, chain)} />,
    <ReferendumTag key="tag" proposal={item.proposal} />,
  ]);

  return (
    <>
      <ScrollerX>
        <NoBorderList loading={!data} columns={columns} rows={rows} />
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
