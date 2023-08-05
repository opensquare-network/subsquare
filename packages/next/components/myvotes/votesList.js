import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import {
  PostTitle,
  ReferendumTag,
} from "next-common/components/profile/votingHistory/common";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemoveVoteButton from "./removeVoteButton";
import useVotedPost from "./useVotedPost";
import MyVoteItem from "./vote";

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

export default function VotesList({ votes }) {
  const columnsDefinition = [
    {
      name: "Proposal",
      style: { textAlign: "left", minWidth: "230px", maxWidth: 600 },
    },
    {
      name: "Vote for",
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
  ];

  const { columns } = useColumns(columnsDefinition);

  const rows = (votes || []).map((item) => {
    return {
      useData: () => {
        const referendumPost = useVotedPost(item.referendumIndex);

        // const vote = normalizeVote(item.vote);

        const row = [
          referendumPost ? (
            <PostTitle
              key="proposal"
              referendumIndex={item.referendumIndex}
              title={referendumPost?.title}
            />
          ) : (
            <FieldLoading />
          ),
          <MyVoteItem key="vote" vote={item} />,
          referendumPost ? (
            <ReferendumTag key="tag" proposal={referendumPost?.onchainData} />
          ) : (
            <FieldLoading />
          ),
          <RemoveVoteButton key="action" vote={item} />,
        ];

        row.key = item.referendumIndex;

        return row;
      },
    };
  });

  return (
    <ListWrapper>
      <StyledList loading={!votes} columns={columns} rows={rows} />
    </ListWrapper>
  );
}
