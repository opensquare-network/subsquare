import BigNumber from "bignumber.js";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";

export default function SubmissionDeposit() {
  const api = useContextApi();
  const { symbol, decimals } = useChainSettings();
  const deposit = new BigNumber(api?.consts?.democracy?.minimumDeposit || 0)
    .div(Math.pow(10, decimals))
    .toNumber();

  return (
    <div>
      <PopupLabel text="Submission Deposit" />
      <Input disabled value={deposit} placeholder="0" symbol={symbol} />
    </div>
  );
}
