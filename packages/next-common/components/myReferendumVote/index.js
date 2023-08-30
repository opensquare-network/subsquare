import styled from "styled-components";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { VoteItem } from "./voteItem";
import Link from "next/link";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import DelegationStatus from "./delegationStatus";
import tw from "tailwind-styled-components";

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

export default function MyVoteCommon({ votes }) {
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const { hasReferenda, noDemocracyModule } = useChainSettings();
  const hasVotesManagement =
    !isKintsugi && (hasReferenda || !noDemocracyModule);

  if (!votes || votes.length === 0) {
    return null;
  }

  let voteType = "Standard";
  if (votes[0].isSplit) {
    voteType = "Split";
  } else if (votes[0].isSplitAbstain) {
    voteType = "SplitAbstain";
  }

  const isDelegating = votes[0].isDelegating;
  const delegatingTarget = votes[0].target;

  return (
    <SecondaryCardDetail>
      <Title>
        My Vote
        <span className="text-textTertiary text14Medium">{voteType}</span>
      </Title>

      <div className="flex flex-col gap-[16px]">
        <div>
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
        </div>

        {isDelegating && (
          <DelegationStatus delegatingTarget={delegatingTarget} />
        )}

        {hasVotesManagement && (
          <div className="flex justify-end">
            <Button href="/votes">
              <span>Manage My Votes</span>
            </Button>
          </div>
        )}
      </div>
    </SecondaryCardDetail>
  );
}
