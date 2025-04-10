import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion } from "@osn/icons/subsquare";
import { useOpenGovVotesPowerContext } from "../context/votesPower";
import LoadableContent from "next-common/components/common/loadableContent";

export function VotesPowerContent({
  votesPower,
  isLoading,
  isReferenda = true,
}) {
  const { decimals, symbol } = useChainSettings();

  const tooltipText = `Votes Power = Self Balance * 6 + ${
    isReferenda ? "Max " : ""
  }Delegations`;

  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      <Tooltip content={tooltipText} className="space-x-1 leading-none">
        <span className="text12Medium text-textTertiary">Votes Power</span>
        <SystemQuestion className="inline-flex w-4 h-4 cursor-pointer [&_path]:fill-textTertiary" />
      </Tooltip>
      <LoadableContent isLoading={isLoading}>
        <ValueDisplay
          value={toPrecision(votesPower, decimals)}
          symbol={symbol}
          className="text16Bold"
        />
      </LoadableContent>
    </div>
  );
}

export default function VotesPowerValueDisplay() {
  const { votesPower, isLoading } = useOpenGovVotesPowerContext();

  return <VotesPowerContent votesPower={votesPower} isLoading={isLoading} />;
}
