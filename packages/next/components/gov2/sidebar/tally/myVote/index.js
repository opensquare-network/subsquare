import useAddressVote from "next-common/utils/hooks/referenda/useAddressVote";
import useApi from "next-common/utils/hooks/useApi";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import NoVoteRecord from "components/referenda/popup/noVoteRecord";
import LoadingVoteStatus from "components/referenda/popup/loadingVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import styled from "styled-components";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote({ referendumIndex, trackId }) {
  const api = useApi();
  const realAddress = useRealAddress();

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

  return (
    <Wrapper>
      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {addressVote?.standard && (
        <StandardVoteStatus
          title="My voting"
          addressVoteStandard={addressVote?.standard}
        />
      )}
      {addressVote?.split && (
        <SplitVoteStatus
          title="My voting"
          addressVoteSplit={addressVote?.split}
        />
      )}
      {addressVote?.delegating && addressVoteDelegateVoted && (
        <DelegateVoteStatus
          title="My voting"
          addressVoteDelegate={addressVote?.delegating}
        />
      )}
      {addressVoteIsLoading && <LoadingVoteStatus />}
    </Wrapper>
  );
}
