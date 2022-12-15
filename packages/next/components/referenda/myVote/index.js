import styled from "styled-components";
import { useAddressVote } from "utils/hooks";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ detail, isVoting = true }) {
  let atBlockHeight;
  if (!isVoting) {
    const timeline = detail?.onchainData?.timeline;
    atBlockHeight = timeline[timeline.length - 1]?.indexer.blockHeight;
  }

  const api = useBlockApi(atBlockHeight);
  const realAddress = useRealAddress();

  const referendumIndex = detail?.referendumIndex;

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
    referendumIndex,
    realAddress
  );

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  if (!realAddress) {
    return null;
  }

  if (
    addressVoteIsLoading ||
    (!addressVote?.standard && !addressVote?.split && !addressVoteDelegateVoted)
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
