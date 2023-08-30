import styled from "styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { VoteItem } from "./voteItem";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { Button } from "../styled";
import Link from "next/link";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function MyVote() {
  const pageType = useDetailType();
  const allVotes = useSelector(allVotesSelector);

  const realAddress = useRealAddress();

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return null;
  }

  if (!realAddress) {
    return null;
  }

  const votes = allVotes?.filter((item) => item.account === realAddress);
  if (!votes || votes.length === 0) {
    return null;
  }

  votes.sort((a, b) => {
    let priorA = a.isAbstain ? 3 : a.aye ? 1 : 2;
    let priorB = b.isAbstain ? 3 : b.aye ? 1 : 2;
    return priorA - priorB;
  });

  let voteType = "";
  if (votes[0].isDelegating) {
    voteType = "Delegating";
  } else if (votes[0].isSplit) {
    voteType = "Split";
  } else if (votes[0].isSplitAbstain) {
    voteType = "SplitAbstain";
  }

  return (
    <SecondaryCardDetail>
      <Title>
        My Vote
        <span className="text-textTertiary text14Medium">{voteType}</span>
      </Title>

      <div className="flex flex-col gap-[24px]">
        <div>
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
        </div>

        <Link className="flex justify-end" href="/votes">
          <Button className="inline-flex !text14Medium">Manage My Votes</Button>
        </Link>
      </div>
    </SecondaryCardDetail>
  );
}
