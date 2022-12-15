import styled from "styled-components";
import useAddressVote from "next-common/utils/hooks/referenda/useAddressVote";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "components/referenda/myVote/delegateVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import findLast from "lodash.findlast";
import { gov2FinalState } from "next-common/utils/consts/state";
import { useTimelineData } from "next-common/context/post";
import LoadingVoteStatus from "components/referenda/popup/loadingVoteStatus";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ detail }) {
  let atBlockHeight;
  const timeline = useTimelineData();

  const finalStateItem = findLast(timeline, ({ name }) =>
    gov2FinalState.includes(name)
  );
  if (finalStateItem) {
    atBlockHeight = finalStateItem?.indexer.blockHeight;
  }

  const api = useBlockApi(atBlockHeight);
  const realAddress = useRealAddress();

  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const updateTime = detail?.onchainData?.state?.indexer.blockTime;

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
    trackId,
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

  if (addressVoteIsLoading) {
    return (
      <Wrapper>
        <LoadingVoteStatus title="My vote" />
      </Wrapper>
    );
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
