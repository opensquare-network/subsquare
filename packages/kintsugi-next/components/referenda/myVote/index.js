import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";

import styled from "styled-components";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import tw from "tailwind-styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import useSubMyDemocracyVote from "hooks/democracy/useSubMyDemocracyVote";
import { usePost } from "next-common/context/post";
import { useState } from "react";
import { isNil } from "lodash-es";
import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import dynamicPopup from "next-common/lib/dynamic/popup";

const RemoveDemocracyVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeDemocracyVotePopup"),
);

export const Button = tw.div`
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
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const allVotes = useSelector(allVotesSelector);
  const realAddress = useRealAddress();

  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  let { vote } = useSubMyDemocracyVote(referendumIndex, realAddress);
  const hasOnchainVote = !isNil(vote);

  const finishHeight = useDemocracyVoteFinishedHeight();
  if (finishHeight) {
    vote = allVotes?.find((vote) => vote.account === realAddress);
  }

  if (!vote) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <Title>My Vote</Title>

      <VoteItem vote={vote} />

      <div className="flex justify-end gap-[16px] mt-[16px]">
        {hasOnchainVote && (
          <Button onClick={() => setShowRemoveVotePopup(true)}>Remove</Button>
        )}
      </div>

      {showRemovePopup && (
        <RemoveDemocracyVotePopup
          referendumIndex={referendumIndex}
          onClose={() => setShowRemoveVotePopup(false)}
        />
      )}
    </SecondaryCardDetail>
  );
}
