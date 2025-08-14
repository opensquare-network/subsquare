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
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

export default function VoteProgress({ height = 8 }) {
  return (
    <BarWrapper>
      <BarContainer className="bg-neutral200" $height={height}>
        <AyesBar precent={10} />
        <NaysBar precent={50} />
        <Abstain precent={20} />
      </BarContainer>
    </BarWrapper>
  );
}

export function AyeValue() {
  return (
    <div className="flex items-center gap-2">
      <SystemVoteAye className="w-4 h-4" />
      <span className="text-green500">Aye</span>
      <span>40</span>
    </div>
  );
}

export function NayValue() {
  return (
    <div className="flex items-center gap-2">
      <SystemVoteNay className="w-4 h-4" />
      <span className="text-red500">Nay</span>
      <span>40</span>
    </div>
  );
}

export function AbstainValue() {
  return (
    <div className="flex items-center gap-2">
      <SystemVoteAbstain className="w-4 h-4" />
      <span className="text-textTertiary">Abstain</span>
      <span>40</span>
    </div>
  );
}

function SplitDot() {
  return <span className="text-textTertiary">·</span>;
}

export function VoteValues() {
  return (
    <div className="flex items-center gap-2 text14Medium">
      <AyeValue />
      <SplitDot />
      <NayValue />
      <SplitDot />
      <AbstainValue />
    </div>
  );
}

export function VoteWrapper({ height = 8, className = "" }) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <VoteValues />
      <Tooltip content="Total votes: 89/100">
        <VoteProgress height={height} />
      </Tooltip>
    </div>
  );
}
