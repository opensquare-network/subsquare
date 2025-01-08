import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import { toPrecision } from "next-common/utils";
import useApiProperties from "next-common/hooks/useApiProperties";

export default function ExistentialDeposit({ destApi, title }) {
  const { decimals } = useApiProperties(destApi);
  return (
    <div>
      <PopupLabel text={title || "Destination Existential Deposit"} />
      <CurrencyInput
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
