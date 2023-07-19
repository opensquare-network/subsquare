import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import VoteItem from "./voteItem";
import DetailButton from "./detailButton";
import { PostTitle } from "./common";

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

export default function DemocracyVotesList({
  data,
  fetchData,
  setShowVoteDetail,
}) {
  const { columns } = useColumns([
    { name: "Proposals", style: { textAlign: "left", minWidth: "230px" } },
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
    <PostTitle key="proposal" vote={item} isGov2={false} />,
    <VoteItem key="vote" vote={item} />,
    <DemocracyReferendumTag
      key="status"
      state={item.proposal?.state?.state}
      args={getDemocracyStateArgs(
        item.proposal?.state,
        item.proposal?.timeline,
      )}
    />,
    <DetailButton key="detail-btn" onClick={() => setShowVoteDetail(item)} />,
  ]);

  return (
    <>
      <ListWrapper>
        <StyledList columns={columns} rows={rows} />
      </ListWrapper>
      <Pagination
        {...data}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
