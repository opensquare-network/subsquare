import tw from "tailwind-styled-components";
import styled from "styled-components";
import AyeIcon from "./icons/aye.svg";
import NayIcon from "./icons/nay.svg";
import AbstainIcon from "./icons/abstain.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import Tooltip from "next-common/components/tooltip";

const ItemWrapper = tw.div`flex max-md:justify-between max-md:grow`;

const VoteWrapper = tw.div`flex flex-col gap-[2px] max-md:grow`;

const VoteTypeWrapper = tw.div`flex gap-[8px] items-center`;

const ConvictionWrapper = tw.div`flex w-[64px] justify-end text-textTertiary items-center`;

const PartialVoteItem = tw.div`flex justify-between md:w-[200px]`;

const ColoredAbstainIcon = styled(AbstainIcon)`
  path {
    fill: var(--textTertiary);
  }
`;

const VoteText = styled.span``;

function Aye() {
  return (
    <VoteTypeWrapper>
      <AyeIcon />
      <VoteText style={{ color: "var(--green500)" }}>Aye</VoteText>
    </VoteTypeWrapper>
  );
}

function Nay() {
  return (
    <VoteTypeWrapper>
      <NayIcon />
      <VoteText style={{ color: "var(--red500)" }}>Nay</VoteText>
    </VoteTypeWrapper>
  );
}

function Abstain() {
  return (
    <VoteTypeWrapper>
      <ColoredAbstainIcon />
      <VoteText style={{ color: "var(--textTertiary)" }}>Abstain</VoteText>
    </VoteTypeWrapper>
  );
}

function ConvictionLabel({ vote }) {
  return (
    <span style={{ color: "var(--textTertiary)" }}>
      <VoteLabel {...{ conviction: 0, ...vote }} />
    </span>
  );
}

function StandardVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <ItemWrapper>
      <VoteWrapper>
        <PartialVoteItem>
          {vote.aye ? <Aye /> : <Nay />}
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.votes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
      </VoteWrapper>
      <ConvictionWrapper>
        <Tooltip content="Standard">
          <ConvictionLabel vote={vote} />
        </Tooltip>
      </ConvictionWrapper>
    </ItemWrapper>
  );
}

function SplitVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <ItemWrapper>
      <VoteWrapper>
        <PartialVoteItem>
          <Aye />
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.ayeVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Nay />
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.nayVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
      </VoteWrapper>
      <ConvictionWrapper>
        <Tooltip content="Split">0.1x/s</Tooltip>
      </ConvictionWrapper>
    </ItemWrapper>
  );
}

function SplitAbstainVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <ItemWrapper>
      <VoteWrapper>
        <PartialVoteItem>
          <Aye />
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.ayeVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Nay />
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.nayVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Abstain />
          <ValueDisplay
            className="text-textPrimary"
            value={toPrecision(vote.abstainVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
      </VoteWrapper>
      <ConvictionWrapper>
        <Tooltip content="SplitAbstain">0.1x/sa</Tooltip>
      </ConvictionWrapper>
    </ItemWrapper>
  );
}

export default function VoteItem({ vote }) {
  if (vote.isStandard || vote.isDelegating) {
    return <StandardVoteItem vote={vote} />;
  }

  if (vote.isSplit) {
    return <SplitVoteItem vote={vote} />;
  }

  if (vote.isSplitAbstain) {
    return <SplitAbstainVoteItem vote={vote} />;
  }

  return null;
}
