import BigNumber from "bignumber.js";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export default function SubmissionDeposit({ pallet = "referenda" }) {
  const api = useContextApi();
  const { symbol, decimals } = useChainSettings();
  const deposit = new BigNumber(api?.consts?.[pallet]?.submissionDeposit || 0)
    .div(Math.pow(10, decimals))
    .toNumber();

  return (
    <div>
      <PopupLabel text="Submission Deposit" />
      <Input disabled value={deposit} placeholder="0" symbol={symbol} />
    </div>
  );
}
