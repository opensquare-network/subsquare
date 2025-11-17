import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import { toPrecision } from "next-common/utils";
import useApiProperties from "next-common/hooks/useApiProperties";
import { Skeleton } from "next-common/components/skeleton";

export default function ExistentialDeposit({ destApi, title }) {
  const { decimals, isLoading } = useApiProperties(destApi);
  const loading = isLoading || !destApi;

  return (
    <div>
      <PopupLabel text={title || "Destination Existential Deposit"} />
      {loading ? (
        <Skeleton className="h-[40px]" />
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
