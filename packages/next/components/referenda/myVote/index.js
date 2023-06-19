import styled from "styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import StandardVoteStatus from "../popup/standardVoteStatus";
import SplitVoteStatus from "../popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";

const Wrapper = styled.div`
  color: var(--textPrimary);
  margin-top: 24px;
`;

export default function MyVote() {
  const realAddress = useRealAddress();
  const { vote: addressVote  } = useSubMyDemocracyVote();
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
