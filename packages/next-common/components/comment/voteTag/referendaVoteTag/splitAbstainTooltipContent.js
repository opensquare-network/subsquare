import { toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";

export default function SplitAbstainVoteTooltipContent({ votes }) {
  const { decimals, symbol } = useChainSettings();
  const abstainVote = votes.find((item) => item.isAbstain);
  const ayeVote = votes.find((item) => item.aye);
  const nayVote = votes.find((item) => item.aye === false);
  const aye = toPrecisionNumber(ayeVote?.votes ?? 0, decimals);
  const nay = toPrecisionNumber(nayVote?.votes ?? 0, decimals);
  const abstain = toPrecisionNumber(abstainVote?.votes ?? 0, decimals);

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span className="text12Bold">Voted SplitAbstain</span>
      <span>Aye: {<ValueDisplay value={aye} symbol={symbol} />}</span>
      <span>Nay: {<ValueDisplay value={nay} symbol={symbol} />}</span>
      <span>Abstain: {<ValueDisplay value={abstain} symbol={symbol} />}</span>
    </div>
  );
}
