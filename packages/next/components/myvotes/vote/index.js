import { VoteItem } from "next-common/components/profile/votingHistory/common";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import useVoteExpiration from "./useVoteExpiration";
import VoteLock from "./lock";

const Wrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

export default function MyVoteItem({ vote }) {
  const lockInfo = useVoteExpiration(vote);

  return (
    <Wrapper>
      <VoteItem key="vote" vote={vote.vote} />
      <VoteLock lockInfo={lockInfo} />
    </Wrapper>
  );
}
