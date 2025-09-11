import useCall from "next-common/utils/hooks/useCall";

export default function useApiProperties(api) {
  const { value: properties, loading } = useCall(
    api?.rpc.system?.properties,
    [],
  );
  const { tokenDecimals, tokenSymbol } = properties || {};
  const symbol = tokenSymbol?.unwrap()?.[0]?.toHuman();
  const decimals = tokenDecimals?.unwrap()?.[0].toNumber();
  return {
    symbol,
    decimals,
    isLoading: loading,
  };
}
