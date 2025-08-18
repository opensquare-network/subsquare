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
    <div className="flex items-center gap-2">
      <SystemVoteAye className="w-4 h-4" />
      <span className="text-green500">Aye</span>
      <span>{aye}</span>
    </div>
  );
}

export function NayValue({ nay }) {
  return (
    <div className="flex items-center gap-2">
      <SystemVoteNay className="w-4 h-4" />
      <span className="text-red500">Nay</span>
      <span>{nay}</span>
    </div>
  );
}

export function AbstainValue({ abstain }) {
  return (
    <div className="flex items-center gap-2">
      <SystemVoteAbstain className="w-4 h-4" />
      <span className="text-textTertiary">Abstain</span>
      <span>{abstain}</span>
    </div>
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
