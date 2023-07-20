import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import VoteItem from "./voteItem";
import DetailButton from "./detailButton";
import { PostTitle } from "./common";
import ReferendumTag from "./common/referendumTag";

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

export default function VotesList({
  data,
  isGov2,
  fetchData,
  setShowVoteDetail,
  page,
}) {
  const { columns } = useColumns([
    { name: "Proposal", style: { textAlign: "left", minWidth: "230px" } },
    {
      name: "Vote",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
    {
      name: "",
      style: { textAlign: "right", width: "64px", minWidth: "64px" },
    },
  ]);

  const rows = (data?.items || []).map((item) => [
    <PostTitle key="proposal" vote={item} isGov2={isGov2} />,
    <VoteItem key="vote" vote={item} />,
    <ReferendumTag key="tag" vote={item} isGov2={isGov2} />,
    <DetailButton key="detail" onClick={() => setShowVoteDetail(item)} />,
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
