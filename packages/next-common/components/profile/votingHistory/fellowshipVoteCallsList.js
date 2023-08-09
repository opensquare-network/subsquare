import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import {
  ReferendumTag,
  PostTitle,
  CallDate,
  FellowshipVoteItem,
} from "./common";

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

export default function FellowshipVoteCallsList({ data, fetchData, page }) {
  const { columns } = useColumns([
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "180px", maxWidth: 384 },
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
    <FellowshipVoteItem key="vote" vote={item} />,
    <ReferendumTag key="tag" proposal={item.proposal} />,
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
