import { toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { StandardVoteTagWithTooltipContent } from "../referendaVoteTag";

function StandardVoteTooltipContent({ vote }) {
  const { decimals, voteSymbol } = useChainSettings();

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span>
        Votes:{" "}
        <ValueDisplay
          value={toPrecisionNumber(vote.votes, decimals)}
          symbol={voteSymbol}
        />
      </span>
    </div>
  );
}

export default function StandardVoteTag({ vote }) {
  const tooltipContent = <StandardVoteTooltipContent vote={vote} />;
  return (
    <StandardVoteTagWithTooltipContent
      vote={vote}
      tooltipContent={tooltipContent}
    />
  );
}
