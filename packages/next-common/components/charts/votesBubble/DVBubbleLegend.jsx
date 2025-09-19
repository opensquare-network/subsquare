import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import { useState } from "react";
import { useDecentralizedVoicesVotes } from "next-common/hooks/referenda/useDecentralizedVoicesVotes";
import { useDecentralizedVoicesValue } from "next-common/hooks/referenda/useDecentralizedVoicesValue";
import { useDecentralizedVoicesPercentage } from "next-common/hooks/referenda/useDecentralizedVoicesPercentage";
import dynamicPopup from "next-common/lib/dynamic/popup";
import LineStatistic, {
  LineStatisticDecimalsItem,
} from "next-common/components/styled/lineStatistic";

const DVDetailPopup = dynamicPopup(() => import("./DVDetailPopup"));

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
        <LineStatistic>
          <LineStatisticDecimalsItem
            label="Decentralized Voices"
            value={dvVotesValue}
            percentage={dvPercentage}
          />
          <LineStatisticDecimalsItem
            label="Aye"
            value={ayeVotesValue}
            percentage={ayePercentage}
          />
          <LineStatisticDecimalsItem
            label="Nay"
            value={nayVotesValue}
            percentage={nayPercentage}
          />
        </LineStatistic>

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
