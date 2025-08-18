import Progress from "next-common/components/progress";
import { isNil } from "lodash-es";
import voteTabs from "./voteTabs";
import { useMemo } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

const VOTE_BAR_COLOR_MAPS = {
  [voteTabs.Aye]: "var(--green300)",
  [voteTabs.Nay]: "var(--red300)",
  [voteTabs.Abstain]: "var(--neutral300)",
};

export function useMaxTotalVotes(items) {
  return useMemo(() => {
    if (!items || items.length === 0) return BigInt(0);
    return items.reduce((max, item) => {
      const votes = BigInt(item.totalVotes || 0);
      return votes > max ? votes : max;
    }, BigInt(0));
  }, [items]);
}

function VoteBar({ totalVotes, maxTotalVotes, voteType }) {
  if (
    isNil(totalVotes) ||
    BigInt(totalVotes) === BigInt(0) ||
    !maxTotalVotes ||
    BigInt(maxTotalVotes) === BigInt(0)
  ) {
    return null;
  }

  const percentage = Number(
    (BigInt(totalVotes) * BigInt(100)) / BigInt(maxTotalVotes),
  );
  const color = VOTE_BAR_COLOR_MAPS[voteType];

  return (
    <div className="absolute bottom-0 right-0 w-[160px]">
      <Progress
        className="mb-1 h-1 w-[160px]"
        bg="var(--neutral100)"
        fg={color}
        minWidth="2"
        rounded={false}
        alignRight={true}
        percentage={percentage}
      />
    </div>
  );
}

export default function VoteBarCell({ totalVotes, maxTotalVotes, voteType }) {
  const { decimals, voteSymbol, symbol } = useChainSettings();
  const displaySymbol = voteSymbol || symbol;
  return (
    <div
      key="value"
      className="flex flex-col justify-center items-end w-[176px] h-[42px] relative"
    >
      <ValueDisplay
        value={toPrecision(totalVotes, decimals)}
        symbol={displaySymbol}
      />
      <VoteBar
        totalVotes={totalVotes}
        maxTotalVotes={maxTotalVotes}
        voteType={voteType}
      />
    </div>
  );
}
