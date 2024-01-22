import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";

export default function LockedBalance({ lockedBalance, setLockedBalance }) {
  const { symbol } = useChainSettings();

  return (
    <div>
      <PopupLabel text="Locked Balance" />
      <Input
        value={lockedBalance}
        placeholder="0"
        symbol={symbol}
        onChange={(e) => setLockedBalance(e.target.value)}
      />
    </div>
  );
}
