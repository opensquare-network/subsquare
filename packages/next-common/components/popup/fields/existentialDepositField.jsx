import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import Input from "next-common/components/input";
import { toPrecision } from "next-common/utils";

export default function ExistentialDeposit({ destApi, title }) {
  const { decimals } = useChainSettings();
  return (
    <div>
      <PopupLabel text={title || "Destination Existential Deposit"} />
      <Input
        disabled
        value={toPrecision(
          destApi?.consts.balances?.existentialDeposit || 0,
          decimals,
        )}
        symbol="DOT"
      />
    </div>
  );
}
