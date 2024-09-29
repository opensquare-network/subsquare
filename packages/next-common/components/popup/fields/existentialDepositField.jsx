import PopupLabel from "../label";
import Input from "next-common/components/input";
import { toPrecision } from "next-common/utils";
import useApiProperties from "next-common/hooks/useApiProperties";

export default function ExistentialDeposit({ destApi, title }) {
  const { decimals } = useApiProperties(destApi);
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
