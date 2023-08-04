import {
  useIsReferenda,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import useVoteExpiration from "./useVoteExpiration";

const Wrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

export default function MyVoteItem({ vote }) {
  console.log("vote", vote);
  const isReferenda = useIsReferenda();
  console.log("isReferenda", isReferenda);
  // const { timeline } = referendum;
  // todo: fetch referendum timeline, so we can know the vote finished height
  // todo: calc the expired info

  useVoteExpiration(vote);

  return (
    <Wrapper>
      <VoteItem key="vote" vote={vote} />
      <div>hello world</div>
    </Wrapper>
  );
}
