import { useSelector } from "react-redux";
import { myDemocracyDelegatedVotesSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";
import { ListCard, ListWrapper, StyledList } from "../../styled";
import useColumns from "next-common/components/styledList/useColumns";
import {
  actionColumnDefinition,
  proposalColumnDefinition,
  statusColumnDefinition,
  voteColumnDefinition,
} from "../../common/votesListColumns";
import { PostTitle } from "next-common/components/profile/votingHistory/common";
import DelegatedVoteForItem from "./voteForItem";
import DemocracyTag from "../stateTag";

export default function DesktopList() {
  const myDelegatedVotes = useSelector(myDemocracyDelegatedVotesSelector);
  const { columns } = useColumns([
    proposalColumnDefinition,
    voteColumnDefinition,
    statusColumnDefinition,
    actionColumnDefinition,
  ]);

  const rows = (myDelegatedVotes || []).map((vote) => ({
    useData: () => {
      const row = [
        <PostTitle
          key="proposal"
          referendumIndex={vote.referendumIndex}
          title={vote.post?.title}
        />,
        <DelegatedVoteForItem
          key="vote"
          targetVote={vote.vote}
          referendumInfo={vote.referendumInfo}
        />,
        <DemocracyTag key="tag" onchainData={vote.post?.onchainData} />,
      ];
      row.key = vote.referendumIndex;
      return row;
    },
  }));

  return (
    <ListCard>
      <ListWrapper>
        <StyledList columns={columns} rows={rows} loading={!myDelegatedVotes} />
      </ListWrapper>
    </ListCard>
  );
}
