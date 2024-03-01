import { useSelector } from "react-redux";
import { myDemocracyDelegatedVotesSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";
import { ListCard } from "../../styled";
import useColumns from "next-common/components/styledList/useColumns";
import { commonVoteColumnsDefinition } from "../../common/votesListColumns";
import { PostTitle } from "next-common/components/profile/votingHistory/common";
import DelegatedVoteForItem from "./voteForItem";
import DemocracyTag from "../stateTag";
import getPostTitle from "./getPostTitle";
import DelegationHint from "./hint";
import ProxyHint from "../../proxyHint";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";

export default function DesktopList() {
  const myDelegatedVotes = useSelector(myDemocracyDelegatedVotesSelector);
  const { columns } = useColumns(commonVoteColumnsDefinition);

  const rows = (myDelegatedVotes || []).map((vote) => {
    const row = [
      <PostTitle
        key="proposal"
        referendumIndex={vote.referendumIndex}
        title={getPostTitle(vote)}
      />,
      <DelegatedVoteForItem
        key="vote"
        targetVote={vote.vote}
        referendumInfo={vote.referendumInfo}
      />,
      <DemocracyTag
        key="tag"
        post={vote.post}
        onchainInfo={vote.referendumInfo}
      />,
    ];
    row.key = vote.referendumIndex;
    return row;
  });

  return (
    <ListCard>
      <ProxyHint style={{ marginBottom: 4 }} />
      <DelegationHint style={{ marginBottom: 8 }} />
      <ScrollerX>
        <DataList columns={columns} rows={rows} loading={!myDelegatedVotes} />
      </ScrollerX>
    </ListCard>
  );
}
