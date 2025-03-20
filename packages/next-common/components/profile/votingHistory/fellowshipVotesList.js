import useColumns from "next-common/components/styledList/useColumns";
import { FellowshipVoteItem, PostTitle, ReferendumTag } from "./common";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";

export default function FellowshipVotesList({ data }) {
  const columnsDefinition = [
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "230px" },
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
    <ScrollerX>
      <DataList loading={!data} columns={columns} rows={rows} />
    </ScrollerX>
  );
}
