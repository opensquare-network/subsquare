import styled from "styled-components";
import { usePost } from "next-common/context/post";
import VoteStatus from "../popup/voteStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import PopupLabel from "next-common/components/popup/label";
import useSubMyDemocracyVote from "../../../hooks/democracy/useSubMyDemocracyVote";

const Wrapper = styled.div`
  color: var(--textPrimary);
  margin-top: 24px;
`;

export default function MyVote() {
  const detail = usePost();
  const realAddress = useRealAddress();
  const referendumIndex = detail?.referendumIndex;
  const { vote: addressVote } = useSubMyDemocracyVote(referendumIndex, realAddress);

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
