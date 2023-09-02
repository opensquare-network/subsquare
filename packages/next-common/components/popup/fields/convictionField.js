import PopupLabel from "next-common/components/popup/label";
import useVoteLockTime from "next-common/utils/hooks/useVoteLockTime";
import Loading from "../../loading";
import { StatusWrapper } from "../styled";
import ConvictionSlider from "next-common/components/convictionSlider";
import { useChainSettings } from "next-common/context/chain";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";

export default function ConvictionField({
  balance = 0,
  conviction,
  setConviction,
  title = "Conviction",
  titleTooltip = "",
  module,
}) {
  const [time, isLoading] = useVoteLockTime(conviction, module);
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

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
          <div className="value">
            <span>Votes</span>
          </div>
          <div className="result">
            {calcVotes(balance, conviction)} {symbol}
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="value">
            <span>Locked For</span>
          </div>
          <div className="result">{time ? "≈ " + time : 0}</div>
        </div>
      </StatusWrapper>
    );
  }

  return (
    <div>
      <PopupLabel text={title} titleTooltip={titleTooltip} />
      <ConvictionSlider value={conviction} setValue={setConviction} />
      {lockingPeriod && <div className="mt-2">{lockingPeriod}</div>}
    </div>
  );
}
