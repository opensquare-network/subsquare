import useApiProperties from "next-common/hooks/useApiProperties";
import ExistentialDepositValue from "./existentialDepositValue";

export default function ExistentialDeposit({ destApi, title }) {
  const { symbol, decimals, isLoading } = useApiProperties(destApi);
  const loading = isLoading || !destApi;
  const value = destApi?.consts.balances?.existentialDeposit || 0;

  return (
    <ExistentialDepositValue
      title={title}
      value={value}
      symbol={symbol}
      decimals={decimals}
      loading={loading}
    />
  );
}
