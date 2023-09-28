import { useSelector } from "react-redux";
import myDemocracyVotesSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/votes";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { ListWrapper, StyledList } from "../../../styled";
import useColumns from "next-common/components/styledList/useColumns";
import { commonVoteColumnsDefinition } from "../../../common/votesListColumns";
import { PostTitle } from "next-common/components/profile/votingHistory/common";
import getPostTitle from "../../delegatedVotes/getPostTitle";
import DemocracyVoteForItem from "./voteForItem";
import DemocracyTag from "../../stateTag";
import RemoveVoteButton from "./remove";

export default function DesktopList() {
  const myDemocracyVotes = useSelector(myDemocracyVotesSelector);
  const voting = useSelector(myDemocracyVotingSelector);
  const isLoading = !voting;
  const { columns } = useColumns(commonVoteColumnsDefinition);

  const rows = (myDemocracyVotes || []).map((vote) => {
    return {
      useData: () => {
        const row = [
          <PostTitle
            key="proposal"
            referendumIndex={vote.referendumIndex}
            title={getPostTitle(vote)}
          />,
          <DemocracyVoteForItem key="vote" vote={vote} />,
          <DemocracyTag
            key="tag"
            post={vote.post}
            onchainInfo={vote.referendumInfo}
          />,
          <RemoveVoteButton
            key="action"
            referendumIndex={vote.referendumIndex}
          />,
        ];

        row.key = vote.referendumIndex;
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
