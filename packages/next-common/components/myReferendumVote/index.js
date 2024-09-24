import styled from "styled-components";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { VoteItem } from "./voteItem";
import Link from "next/link";
import { useChainSettings } from "next-common/context/chain";
import DelegationStatus from "./delegationStatus";
import tw from "tailwind-styled-components";
import HintMessage from "../styled/hintMessage";
import useIsProxySet from "next-common/hooks/useIsProxySet";

export const LinkButton = tw(Link)`
  cursor-pointer
  text14Medium
  text-theme500
`;

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

export default function MyVoteCommon({
  votes,
  votesManagementPath,
  hasOnchainVote,
  setShowRemoveVotePopup,
}) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;
  const hasVotesManagement = hasReferenda || hasDemocracyModule;
  const isProxySet = useIsProxySet();

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

        {isProxySet && <HintMessage>Votes of proxied account</HintMessage>}

        <div className="flex justify-end gap-[16px]">
          {hasVotesManagement && (
            <LinkButton href={votesManagementPath}>
              <span>Manage My Votes</span>
            </LinkButton>
          )}
          {hasOnchainVote && (
            <Button onClick={() => setShowRemoveVotePopup(true)}>Remove</Button>
          )}
        </div>
      </div>
    </SecondaryCardDetail>
  );
}
