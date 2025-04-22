import PopupLabel from "next-common/components/popup/label";
import useVoteLockTime from "next-common/utils/hooks/useVoteLockTime";
import Loading from "../../loading";
import { StatusWrapper } from "../styled";
import ConvictionSlider from "next-common/components/convictionSlider";
import { useChainSettings } from "next-common/context/chain";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";
import NumberWithComma from "next-common/components/numberWithComma";
import Tooltip from "next-common/components/tooltip";

export default function ConvictionField({
  balance = 0,
  conviction,
  setConviction,
  title = "Conviction",
  titleTooltip = "",
  module,
}) {
  const [time, isLoading, date] = useVoteLockTime(conviction, module);
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  balance = (isNaN(Number(balance)) ? 0 : balance) || 0;

  let lockingPeriod = null;

  if (isLoading) {
    lockingPeriod = (
      <StatusWrapper>
        <div className="no-data">
          <Loading />
        </div>
      </StatusWrapper>
    );
  } else {
    lockingPeriod = (
      <StatusWrapper className="flex-col gap-y-1">
        <div className="flex justify-between w-full">
          <div className="text-textSecondary">
            <span>Total Votes</span>
          </div>
          <div className="result">
            <NumberWithComma
              value={calcVotes(balance, conviction)}
              symbol={symbol}
            />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-textSecondary">
            <span>Lock Duration</span>
          </div>
          <div className="result">
            {time ? (
              <Tooltip content={`End on ${date}`}>{"≈ " + time}</Tooltip>
            ) : (
              0
            )}
          </div>
        </div>

        <hr className="w-full my-2" />

        <div className="text12Medium text-textTertiary">
          Your {chainSettings.voteSymbol || chainSettings.symbol} will stay
          locked for the entire voting period. After the vote ends, it remains
          locked for an additional period based on your selected multiplier.
        </div>
      </StatusWrapper>
    );
  }

  return (
    <div>
      <PopupLabel
        text={title}
        tooltip={titleTooltip}
        tooltipContentClassName="max-w-[240px]"
      />
      <ConvictionSlider value={conviction} setValue={setConviction} />
      {lockingPeriod && <div className="mt-2">{lockingPeriod}</div>}
    </div>
  );
}
