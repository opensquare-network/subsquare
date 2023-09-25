import useColumns from "next-common/components/styledList/useColumns";
import {
  PostTitle,
  ReferendumTag,
} from "next-common/components/profile/votingHistory/common";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemoveVoteButton from "./removeVoteButton";
import useVotedPost from "./useVotedPost";
import MyVoteItem from "./vote";
import useReferendumTitle from "./useReferendumTitle";
import { useSelector } from "react-redux";
import { myVotedPostsLoading } from "next-common/store/reducers/myVotesSlice";
import { ListWrapper, StyledList } from "./styled";
import { commonVoteColumnsDefinition } from "./common/votesListColumns";

export default function VotesList({ votes, isLoading }) {
  const { columns } = useColumns(commonVoteColumnsDefinition);

  const rows = (votes || []).map((item) => {
    return {
      useData: () => {
        const isPostsLoading = useSelector(myVotedPostsLoading);
        const referendumPost = useVotedPost(item.referendumIndex);
        const title = useReferendumTitle({
          trackId: item.trackId,
          referendumIndex: item.referendumIndex,
        });

        const row = [
          <PostTitle
            key="proposal"
            referendumIndex={item.referendumIndex}
            title={title}
          />,
          <MyVoteItem key="vote" vote={item} />,
          isPostsLoading ? (
            <FieldLoading />
          ) : (
            <ReferendumTag
              key="tag"
              proposal={referendumPost?.onchainData}
              vote={item}
            />
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
      <StyledList loading={isLoading} columns={columns} rows={rows} />
    </ListWrapper>
  );
}
