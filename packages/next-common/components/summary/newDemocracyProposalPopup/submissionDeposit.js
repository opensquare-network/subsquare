import CurrencyInput from "next-common/components/currencyInput";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";

export default function SubmissionDeposit({ deposit }) {
  const { symbol } = useChainSettings();

  return (
    <div>
      <PopupLabel text="Submission Deposit" />
      <CurrencyInput disabled value={deposit} placeholder="0" symbol={symbol} />
    </div>
  );
}
