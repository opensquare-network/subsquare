import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import DetailButton from "next-common/components/detailButton";
import { PostTitle, ReferendumTag, VoteItem } from "./common";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";

export default function VotesList({
  data,
  fetchData,
  setShowVoteDetail,
  page,
}) {
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);

  const columnsDefinition = [
    {
      name: "Proposal",
      style: {
        textAlign: "left",
        minWidth: "230px",
        paddingRight: 16,
      },
    },
    {
      name: "Vote",
      style: { textAlign: "left", width: "264px", minWidth: "264px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "160px", minWidth: "160px" },
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
      <PostTitle
        key="proposal"
        referendumIndex={item.referendumIndex}
        title={item.proposal?.title}
      />,
      <VoteItem key="vote" vote={item} />,
      <ReferendumTag key="tag" proposal={item.proposal} />,
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
