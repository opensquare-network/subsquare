import styled from "styled-components";
import { useAddressVote } from "utils/hooks";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { usePost, useTimelineData } from "next-common/context/post";
import StandardVoteStatus from "../popup/standardVoteStatus";
import SplitVoteStatus from "../popup/splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import VoteStatus from "../popup/voteStatus";

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
    // realAddress,
    "a3dUyqEoBUVpRDgqePbTXVGPaZBCDC4rLmLec6Mvhnef5SJPS",
    updateTime
  );

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
      <PopupLabel text={"Voting status"} />
      <VoteStatus addressVote={addressVote} />
    </Wrapper>
  );
}
