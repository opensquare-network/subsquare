import { useSelector } from "react-redux";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import useColumns from "next-common/components/styledList/useColumns";
import { commonVoteColumnsDefinition } from "../../../common/votesListColumns";
import { ListWrapper, StyledList } from "../../../styled";
import { isLoadingReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { PostTitle } from "next-common/components/profile/votingHistory/common";
import getPostTitle from "./getPostTitle";
import { usePageProps } from "next-common/context/page";
import ReferendaVoteForItem from "./voteForItem";
import MyReferendaVoteTag from "../stateTag";
import RemoveVoteButton from "./remove";

export default function DesktopList() {
  const referendaVotes = useSelector(myReferendaVotesSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  const { columns } = useColumns(commonVoteColumnsDefinition);
  const { tracks } = usePageProps();

  const rows = (referendaVotes || []).map((item) => {
    return {
      useData: () => {
        const row = [
          <PostTitle
            key="proposal"
            referendumIndex={item.referendumIndex}
            title={getPostTitle(item, tracks)}
          />,
          <ReferendaVoteForItem key="vote" vote={item} />,
          <MyReferendaVoteTag
            key="tag"
            post={item.post}
            onchainInfo={item.referendumInfo}
          />,
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
