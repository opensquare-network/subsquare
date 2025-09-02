import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn, toPrecision } from "next-common/utils";
import { useState } from "react";
import { useDecentralizedVoicesVotes } from "next-common/hooks/referenda/useDecentralizedVoicesVotes";
import { useDecentralizedVoicesValue } from "next-common/hooks/referenda/useDecentralizedVoicesValue";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useDecentralizedVoicesPercentage } from "next-common/hooks/referenda/useDecentralizedVoicesPercentage";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DVDetailPopup = dynamicPopup(() => import("./DVDetailPopup"));

function Item({ label = "", value, percentage }) {
  const { decimals } = useChainSettings();

  return (
    <div
      className={cn(
        "flex items-center gap-x-1 text12Medium text-textTertiary",
        "before:content-['·'] before:mx-1 before:first:hidden",
      )}
    >
      <div className="whitespace-nowrap">{label}</div>
      <div className="text-textSecondary flex whitespace-nowrap items-center">
        {(percentage || 0).toFixed(2)}% (
        <ValueDisplay value={toPrecision(value, decimals)} />)
      </div>
    </div>
  );
}

export default function DVBubbleLegend({ className }) {
  const { dvVotesValue, ayeVotesValue, nayVotesValue } =
    useDecentralizedVoicesValue();
  const { dvPercentage, ayePercentage, nayPercentage } =
    useDecentralizedVoicesPercentage();
  const dvVotes = useDecentralizedVoicesVotes();

  const [showDetailPopup, setShowDetailPopup] = useState(false);

  if (!dvVotes.length) {
    return null;
  }

  return (
    <>
      <div className={cn("flex gap-x-2", className)}>
        <div
          className={cn(
            "w-full",
            "flex gap-x-1",
            "py-1.5 px-3 rounded",
            "max-sm:flex-wrap",
            "bg-neutral200",
            "scrollbar-hidden overflow-x-scroll",
          )}
        >
          <Item
            label="Decentralized Voices"
            value={dvVotesValue}
            percentage={dvPercentage}
          />
          <Item label="Aye" value={ayeVotesValue} percentage={ayePercentage} />
          <Item label="Nay" value={nayVotesValue} percentage={nayPercentage} />
        </div>

        <SecondaryButton
          key={"detail"}
          size="small"
          className="w-7 p-0"
          onClick={() => setShowDetailPopup(true)}
        >
          <SystemMenu className="w-4 h-4" />
        </SecondaryButton>
      </div>

      {showDetailPopup && (
        <DVDetailPopup
          closeFunc={() => setShowDetailPopup(false)}
          dvVotes={dvVotes}
          dvVotesValue={dvVotesValue}
          dvPercentage={dvPercentage}
          ayeVotesValue={ayeVotesValue}
          ayePercentage={ayePercentage}
          nayVotesValue={nayVotesValue}
          nayPercentage={nayPercentage}
        />
      )}
    </>
  );
}
