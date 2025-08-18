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

export function useMaxTotalVotes(items, key = "totalVotes") {
  return useMemo(() => {
    if (!items || items.length === 0) {
      return 0n;
    }

    return items.reduce((max, item) => {
      const votes = BigInt(item[key] || 0);
      return votes > max ? votes : max;
    }, 0n);
  }, [items, key]);
}

function VoteBar({ votes, maxTotalVotes, voteType }) {
  if (
    isNil(votes) ||
    BigInt(votes) === 0n ||
    !maxTotalVotes ||
    BigInt(maxTotalVotes) === 0n
  ) {
    return null;
  }

  const percentage = Number((BigInt(votes) * 100n) / BigInt(maxTotalVotes));
  const color = VOTE_BAR_COLOR_MAPS[voteType];

  return (
    <div className="absolute bottom-0 right-0 w-[150px]">
      <Progress
        className="mb-1 h-1 w-[150px]"
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

export default function VoteBarCell({ votes, maxTotalVotes, voteType }) {
  const { decimals, voteSymbol, symbol } = useChainSettings();
  const displaySymbol = voteSymbol || symbol;
  return (
    <div
      key="value"
      className="flex flex-col justify-center items-end w-[170px] h-[42px] relative"
    >
      <ValueDisplay
        value={toPrecision(votes, decimals)}
        symbol={displaySymbol}
      />
      <VoteBar
        votes={votes}
        maxTotalVotes={maxTotalVotes}
        voteType={voteType}
      />
    </div>
  );
}
