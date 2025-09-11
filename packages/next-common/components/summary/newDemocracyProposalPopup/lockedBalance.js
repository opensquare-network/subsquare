import CurrencyInput from "next-common/components/currencyInput";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";

export default function LockedBalance({ lockedBalance, setLockedBalance }) {
  const { symbol } = useChainSettings();

  return (
    <div>
      <PopupLabel text="Locked Balance" />
      <CurrencyInput
        value={lockedBalance}
        placeholder="0"
        symbol={symbol}
        onValueChange={setLockedBalance}
      />
    </div>
  );
}
