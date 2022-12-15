import styled from "styled-components";
import { useAddressVote } from "utils/hooks";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { usePost, useTimelineData } from "next-common/context/post";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import VoteStatus from "../popup/voteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import PopupLabel from "next-common/components/popup/label";

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

  if (!realAddress) {
    return null;
  }

  if (!addressVote) {
    return null;
  }

  return (
    <Wrapper>
      <PopupLabel text="My vote" />
      <VoteStatus addressVote={addressVote} />
    </Wrapper>
  );
}
