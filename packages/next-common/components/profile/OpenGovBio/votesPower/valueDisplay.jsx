import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion } from "@osn/icons/subsquare";
import { useOpenGovVotesPowerContext } from "../context/votesPower";

export function VotesPowerContent({ votesPower, isLoading }) {
  const { decimals, symbol } = useChainSettings();

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center py-4 gap-y-1">
      <Tooltip
        content={"Votes Power = Self Balance * 6 + Max Delegations"}
        className="space-x-1"
      >
        <span className="text12Medium text-textTertiary">Votes Power</span>
        <SystemQuestion className="inline-flex w-4 h-4 cursor-pointer [&_path]:fill-textTertiary" />
      </Tooltip>
      <ValueDisplay
        value={toPrecision(votesPower, decimals)}
        symbol={symbol}
        className="text20Bold"
      />
    </div>
  );
}

export default function VotesPowerValueDisplay() {
  const { votesPower, isLoading } = useOpenGovVotesPowerContext();

  return <VotesPowerContent votesPower={votesPower} isLoading={isLoading} />;
}
