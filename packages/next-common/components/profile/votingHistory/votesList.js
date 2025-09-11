import useColumns from "next-common/components/styledList/useColumns";
import DetailButton from "next-common/components/detailButton";
import { PostTitle, ReferendumTag } from "./common";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import VoteForCell from "./common/voteForCell";
import SelfVotesCell from "./common/selfVotesCell";
import TotalVotesCell from "./common/totalVotes";

export default function VotesList({ data, setShowVoteDetail }) {
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
      name: "Vote for",
      width: 80,
    },
    {
      name: "Self Votes",
      width: 160,
      className: "text-right",
    },
    {
      name: "Total Votes",
      width: 120,
      className: "text-right",
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
        className={"max-sm:whitespace-pre-wrap"}
        key="proposal"
        referendumIndex={item.referendumIndex}
        title={item.proposal?.title}
      />,
      <VoteForCell key={"voteFor"} vote={item} />,
      <SelfVotesCell key={"selfVotes"} vote={item} />,
      <TotalVotesCell key={"totalVotes"} vote={item} />,
      <ReferendumTag key="tag" proposal={item.proposal} />,
    ];

    if (!isKintsugi) {
      data.push(
        <div className="max-sm:self-start">
          <DetailButton key="detail" onClick={() => setShowVoteDetail(item)} />
        </div>,
      );
    }

    return data;
  });

  return (
    <ScrollerX>
      <DataList loading={!data} columns={columns} rows={rows} />
    </ScrollerX>
  );
}
