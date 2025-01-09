import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import {
  ThresholdInfo,
  ThresholdInfoLabel,
  ThresholdInfoValue,
} from "./styled";
import {
  allAyeSelector,
  allNaySelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";

export default function ThresholdVotesCard() {
  const { decimals, symbol } = useChainSettings();
  const tally = useReferendumTally();
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);

  return (
    <ThresholdInfo className="grow w-full !bg-neutral200 !text-textSecondary">
      <div className="flex flex-col gap-y-2">
        <InfoTemplate
          vote="Aye"
          count={allAye?.length}
          icon={<SystemVoteAye className="w-5 h-5" />}
          value={toPrecision(tally?.ayes, decimals)}
          symbol={symbol}
        />
        <InfoTemplate
          vote="Nay"
          count={allNay?.length}
          icon={<SystemVoteNay className="w-5 h-5" />}
          value={toPrecision(tally?.nays, decimals)}
          symbol={symbol}
        />
      </div>
    </ThresholdInfo>
  );
}

function InfoTemplate({ vote, count, icon, symbol, value }) {
  return (
    <div className="flex items-center justify-between">
      <ThresholdInfoLabel className="inline-flex items-center gap-x-2">
        {icon}
        <span>
          {vote}
          <span className="text-textTertiary">({count || 0})</span>
        </span>
      </ThresholdInfoLabel>
      <ThresholdInfoValue>
        <ValueDisplay value={value} symbol={symbol} />
      </ThresholdInfoValue>
    </div>
  );
}
