import BalanceInput from "next-common/components/balanceInput";
import { useChainSettings } from "next-common/context/chain";

export default function BalanceParam() {
  const { symbol } = useChainSettings();
  return <BalanceInput symbol={symbol} />;
}
