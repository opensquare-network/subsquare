import styled from "styled-components";
import useAddressVote from "next-common/utils/hooks/referenda/useAddressVote";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "components/referenda/myVote/delegateVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SplitAbstainVoteStatus from "components/gov2/votePopup/splitAbstainVoteStatus";
import findLast from "lodash.findlast";
import { gov2FinalState } from "next-common/utils/consts/state";
import { usePost, useTimelineData } from "next-common/context/post";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote() {
  const detail = usePost();

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

  const [addressVote] = useAddressVote(
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
    !addressVote?.splitAbstain &&
    !addressVoteDelegateVoted
  ) {
    return null;
  }

  const title = "My voting";

  return (
    <Wrapper>
      {addressVote?.splitAbstain && (
        <SplitAbstainVoteStatus
          title={title}
          addressVoteSplit={addressVote?.splitAbstain}
        />
      )}
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
