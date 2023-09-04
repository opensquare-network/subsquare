import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";

import styled from "styled-components";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Link from "next/link";
import tw from "tailwind-styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import useSubMyDemocracyVote from "hooks/democracy/useSubMyDemocracyVote";
import { usePost } from "next-common/context/post";

export const Button = tw(Link)`
  cursor-pointer
  text14Medium
  text-theme500
`;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function MyVote() {
  const allVotes = useSelector(allVotesSelector);
  const realAddress = useRealAddress();

  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  let { vote } = useSubMyDemocracyVote(referendumIndex, realAddress);
  if (!vote) {
    vote = allVotes?.find((vote) => vote.account === realAddress);
  }

  if (!vote) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <Title>My Vote</Title>

      <VoteItem vote={vote} />
    </SecondaryCardDetail>
  );
}
