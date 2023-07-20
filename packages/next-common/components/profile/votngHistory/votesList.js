import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import VoteItem from "./voteItem";
import DetailButton from "./detailButton";
import { PostTitle } from "./common";
import ReferendumTag from "./common/referendumTag";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";

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
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);

  const columnsDefinition = [
    { name: "Proposal", style: { textAlign: "left", minWidth: "230px" } },
    {
      name: "Vote",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ];

  if (!isKintsugi) {
    columnsDefinition.push({
      name: "",
      style: { textAlign: "right", width: "64px", minWidth: "64px" },
    });
  }

  const { columns } = useColumns(columnsDefinition);

  const rows = (data?.items || []).map((item) => {
    const data = [
      <PostTitle key="proposal" vote={item} isGov2={isGov2} />,
      <VoteItem key="vote" vote={item} />,
      <ReferendumTag key="tag" vote={item} isGov2={isGov2} />,
    ];

    if (!isKintsugi) {
      data.push(
        <DetailButton key="detail" onClick={() => setShowVoteDetail(item)} />,
      );
    }

    return data;
  });

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
