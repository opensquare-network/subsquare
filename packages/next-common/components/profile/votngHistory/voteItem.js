import tw from "tailwind-styled-components";
import styled from "styled-components";
import AyeIcon from "./icons/aye.svg";
import NayIcon from "./icons/nay.svg";
import AbstainIcon from "./icons/abstain.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import FlexBetween from "next-common/components/styled/flexBetween";
import Flex from "next-common/components/styled/flex";

const VoteWrapper = tw.div`flex flex-col gap-[2px]`;

const VoteTypeWrapper = tw.div`flex gap-[8px]`;

const PartialVoteItem = styled(FlexBetween)`
  width: 200px;
`;

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
      <VoteLabel {...vote} />
    </span>
  );
}

function StandardVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <VoteWrapper>
      <Flex>
        <PartialVoteItem>
          {vote.aye ? <Aye /> : <Nay />}
          <ValueDisplay
            value={toPrecision(vote.votes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <div className="w-[52px] text-right">
          <ConvictionLabel vote={vote} />
        </div>
      </Flex>
    </VoteWrapper>
  );
}

function SplitVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <Flex>
      <VoteWrapper>
        <PartialVoteItem>
          <Aye />
          <ValueDisplay
            value={toPrecision(vote.ayeVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Nay />
          <ValueDisplay
            value={toPrecision(vote.nayVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
      </VoteWrapper>
      <div className="w-[52px] text-right text-textTertiary">0.1x/s</div>
    </Flex>
  );
}

function SplitAbstainVoteItem({ vote }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <Flex>
      <VoteWrapper>
        <PartialVoteItem>
          <Aye />
          <ValueDisplay
            value={toPrecision(vote.ayeVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Nay />
          <ValueDisplay
            value={toPrecision(vote.nayVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
        <PartialVoteItem>
          <Abstain />
          <ValueDisplay
            value={toPrecision(vote.abstainVotes, decimals)}
            symbol={symbol}
          />
        </PartialVoteItem>
      </VoteWrapper>
      <div className="w-[52px] text-right text-textTertiary">0.1x/sa</div>
    </Flex>
  );
}

export default function VoteItem({ vote }) {
  if (vote.isStandard) {
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
