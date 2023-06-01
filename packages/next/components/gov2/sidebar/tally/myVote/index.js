import styled from "styled-components";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "components/referenda/myVote/delegateVoteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SplitAbstainVoteStatus from "components/gov2/votePopup/splitAbstainVoteStatus";
import { usePost } from "next-common/context/post";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import useSubMyReferendaVote from "next-common/hooks/referenda/useSubMyReferendaVote";

const Wrapper = styled.div`
  color: ${(p) => p.theme.textPrimary};
  margin-top: 24px;
`;

export default function MyVote() {
  const detail = usePost();
  const pageType = useDetailType();

  const realAddress = useRealAddress();

  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const { vote: addressVote } = useSubMyReferendaVote(trackId, referendumIndex, realAddress);

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return null;
  }

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
