import { VoteItem } from "next-common/components/profile/votingHistory/common";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

export default function MyVoteItem({ vote, referendum = {} }) {
  console.log("referendum", referendum, "vote", vote);
  // const { timeline } = referendum;
  // todo: calc the expired info
  return (
    <Wrapper>
      <VoteItem key="vote" vote={vote} />
      <div>hello world</div>
    </Wrapper>
  );
}
