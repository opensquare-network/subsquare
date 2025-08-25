import {
  BarWrapper,
  BarContainer,
  AyesBar,
  NaysBar,
  Abstain,
} from "next-common/components/styled/barProgress";
import {
  SystemVoteAye,
  SystemVoteNay,
  SystemVoteAbstain,
} from "@osn/icons/subsquare";
import { VoteValueWrapper } from "./styled";

export default function VoteProgress({ height = 8, aye, nay, abstain }) {
  return (
    <BarWrapper>
      <BarContainer className="bg-neutral200" $height={height}>
        <AyesBar precent={aye} />
        <NaysBar precent={nay} />
        <Abstain precent={abstain} />
      </BarContainer>
    </BarWrapper>
  );
}

export function AyeValue({ aye }) {
  return (
    <VoteValueWrapper>
      <SystemVoteAye className="w-4 h-4" />
      <span className="text-green500">Aye</span>
      <span>{aye}</span>
    </VoteValueWrapper>
  );
}

export function NayValue({ nay }) {
  return (
    <VoteValueWrapper>
      <SystemVoteNay className="w-4 h-4" />
      <span className="text-red500">Nay</span>
      <span>{nay}</span>
    </VoteValueWrapper>
  );
}

export function AbstainValue({ abstain }) {
  return (
    <VoteValueWrapper>
      <SystemVoteAbstain className="w-4 h-4" />
      <span className="text-textTertiary">Abstain</span>
      <span>{abstain}</span>
    </VoteValueWrapper>
  );
}

function SplitDot() {
  return <span className="text-textTertiary">·</span>;
}

export function VoteValues({ aye, nay, abstain }) {
  return (
    <div className="flex items-center gap-2 text14Medium text-textPrimary">
      <AyeValue aye={aye} />
      <SplitDot />
      <NayValue nay={nay} />
      <SplitDot />
      <AbstainValue abstain={abstain} />
    </div>
  );
}
