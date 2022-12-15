import styled from "styled-components";
import useAddressVote from "next-common/utils/hooks/referenda/useAddressVote";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SplitAbstainVoteStatus from "components/gov2/votePopup/splitAbstainVoteStatus";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ detail, isVoting }) {
  let atBlockHeight;
  if (!isVoting) {
    const timeline = detail?.onchainData?.timeline;
    const lastTimelineHeight =
      timeline[timeline.length - 1]?.indexer.blockHeight;
    atBlockHeight = lastTimelineHeight - 1;
  }

  const api = useBlockApi(atBlockHeight);
  const realAddress = useRealAddress();

  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
    trackId,
    referendumIndex,
    realAddress
  );

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  if (!realAddress) {
    return null;
  }

  if (
    addressVoteIsLoading ||
    (!addressVote?.standard &&
      !addressVote?.split &&
      !addressVote?.splitAbstain &&
      !addressVoteDelegateVoted)
  ) {
    return null;
  }

  const title = "My voting";

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
      {addressVote?.splitAbstain && (
        <SplitAbstainVoteStatus
          title={title}
          addressVoteSplit={addressVote?.splitAbstain}
        />
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
