import styled from "styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { VoteItem } from "./voteItem";
import Link from "next/link";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import omit from "lodash.omit";

export const Button = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: var(--theme500);
`;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function MyVoteCommon({ allVotes }) {
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const { hasReferenda, noDemocracyModule } = useChainSettings();
  const hasVotesManagement =
    !isKintsugi && (hasReferenda || !noDemocracyModule);

  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  const votes = allVotes?.filter((item) => item.account === realAddress);
  if (!votes || votes.length === 0) {
    return null;
  }

  if (votes[0].isSplit) {
    if (!votes.find((vote) => vote.aye)) {
      votes.push({
        ...votes[0],
        balance: 0,
        aye: true,
      });
    }
    if (!votes.find((vote) => !vote.aye)) {
      votes.push({
        ...votes[0],
        balance: 0,
        aye: false,
      });
    }
  } else if (votes[0].isSplitAbstain) {
    if (!votes.find((vote) => vote.isAbstain)) {
      votes.push({
        ...omit(votes[0], ["aye", "isAbstain"]),
        balance: 0,
        isAbstain: true,
      });
    }
    if (!votes.find((vote) => !vote.isAbstain && vote.aye)) {
      votes.push({
        ...omit(votes[0], ["aye", "isAbstain"]),
        balance: 0,
        aye: true,
      });
    }
    if (!votes.find((vote) => !vote.isAbstain && !vote.aye)) {
      votes.push({
        ...omit(votes[0], ["aye", "isAbstain"]),
        balance: 0,
        aye: false,
      });
    }
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

        {hasVotesManagement && (
          <Link className="flex justify-end" href="/votes">
            <Button className="inline-flex">Manage My Votes</Button>
          </Link>
        )}
      </div>
    </SecondaryCardDetail>
  );
}
