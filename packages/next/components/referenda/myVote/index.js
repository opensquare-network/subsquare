import styled from "styled-components";
import { useAddressVote } from "utils/hooks";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePost, useTimelineData } from "next-common/context/post";
import findLast from "lodash.findlast";
import { democracyReferendumVoteEndState } from "next-common/utils/consts/state";
import StandardVoteStatus from "../popup/standardVoteStatus";
import SplitVoteStatus from "../popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ updateTime }) {
  const detail = usePost();
  let atBlockHeight;
  const timeline = useTimelineData();

  const finalStateItem = findLast(timeline, ({ name }) =>
    democracyReferendumVoteEndState.includes(name)
  );
  if (finalStateItem) {
    atBlockHeight = finalStateItem?.indexer.blockHeight;
  }

  const api = useBlockApi(atBlockHeight);
  const realAddress = useRealAddress();

  const referendumIndex = detail?.referendumIndex;

  const [addressVote] = useAddressVote(
    api,
    referendumIndex,
    realAddress,
    updateTime
  );

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  if (!realAddress) {
    return null;
  }

  if (
    !addressVote?.standard &&
    !addressVote?.split &&
    !addressVoteDelegateVoted
  ) {
    return null;
  }

  return (
    <Wrapper>
      {addressVote?.standard && (
        <StandardVoteStatus
          title="My vote"
          addressVoteStandard={addressVote?.standard}
        />
      )}
      {addressVote?.split && (
        <SplitVoteStatus
          title="My vote"
          addressVoteSplit={addressVote?.split}
        />
      )}
      {addressVoteDelegateVoted && (
        <DelegateVoteStatus
          title="My vote"
          addressVoteDelegate={addressVote?.delegating}
        />
      )}
    </Wrapper>
  );
}
