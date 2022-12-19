import styled from "styled-components";
import { useAddressVote } from "utils/hooks";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePost, useTimelineData } from "next-common/context/post";
import StandardVoteStatus from "../popup/standardVoteStatus";
import SplitVoteStatus from "../popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import extractVoteInfo from "next-common/utils/democracy/referendum";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ updateTime }) {
  const detail = usePost();
  const timeline = useTimelineData();
  const { voteFinishedHeight } = extractVoteInfo(timeline);

  const api = useBlockApi(voteFinishedHeight);
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

  const title = "My vote";

  return (
    <Wrapper>
      {addressVote?.standard && (
        <StandardVoteStatus
          title={title}
          addressVoteStandard={addressVote?.standard}
        />
      )}
      {addressVote?.split && (
        <SplitVoteStatus title={title} addressVoteSplit={addressVote?.split} />
      )}
      {addressVoteDelegateVoted && (
        <DelegateVoteStatus
          title={title}
          addressVoteDelegate={addressVote?.delegating}
        />
      )}
    </Wrapper>
  );
}
