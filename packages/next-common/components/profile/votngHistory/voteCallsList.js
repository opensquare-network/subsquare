import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import VoteItem from "./voteItem";
import { PostTitle, normalizeCall } from "./common";
import ReferendumTag from "./common/referendumTag";
import CallDate from "./common/date";
import { useChain } from "next-common/context/chain";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

const StyledList = styled(StyledListOrigin)`
  border: none;
  box-shadow: none;
  padding: 0;
`;

export default function VoteCallsList({ data, isGov2, fetchData, page }) {
  const chain = useChain();
  const { columns } = useColumns([
    { name: "Proposal", style: { textAlign: "left", minWidth: "180px" } },
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
    <PostTitle key="proposal" vote={item} isGov2={isGov2} />,
    <CallDate key="date" vote={item} />,
    <VoteItem key="vote" vote={normalizeCall(item, chain)} />,
    <ReferendumTag key="tag" vote={item} isGov2={isGov2} />,
  ]);

  return (
    <>
      <ListWrapper>
        <StyledList loading={!data} columns={columns} rows={rows} />
      </ListWrapper>
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
