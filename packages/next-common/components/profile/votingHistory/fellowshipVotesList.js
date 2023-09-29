import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import { FellowshipVoteItem, PostTitle, ReferendumTag } from "./common";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";

export default function FellowshipVotesList({ data, fetchData, page }) {
  const columnsDefinition = [
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "230px", maxWidth: 600 },
    },
    {
      name: "Vote",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ];

  const { columns } = useColumns(columnsDefinition);

  const rows = (data?.items || []).map((item) => {
    const data = [
      <PostTitle
        key="proposal"
        referendumIndex={item.referendumIndex}
        title={item.proposal?.title}
      />,
      <FellowshipVoteItem key="vote" vote={item} />,
      <ReferendumTag key="tag" proposal={item.proposal} />,
    ];

    return data;
  });

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
