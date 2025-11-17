import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import { toPrecision } from "next-common/utils";
import useApiProperties from "next-common/hooks/useApiProperties";
import FieldLoading from "next-common/components/icons/fieldLoading";

export default function ExistentialDeposit({ destApi, title }) {
  const { decimals, isLoading } = useApiProperties(destApi);
  const loading = isLoading || !destApi;

  return (
    <div>
      <PopupLabel text={title || "Destination Existential Deposit"} />
      {loading ? (
        <FieldLoading />
      ) : (
        <CurrencyInput
          disabled
          value={toPrecision(
            destApi?.consts.balances?.existentialDeposit || 0,
            decimals,
          )}
          symbol="DOT"
        />
      )}
    </div>
  );
}
