import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";

export default function SubmissionDeposit({ deposit }) {
  const { symbol } = useChainSettings();

  return (
    <div>
      <PopupLabel text="Submission Deposit" />
      <Input disabled value={deposit} placeholder="0" symbol={symbol} />
    </div>
  );
}
