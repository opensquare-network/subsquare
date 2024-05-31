import { useChain } from "next-common/context/chain";
import useFetch from "./useFetch";

export default function useNativeTokenPrice() {
  const chain = useChain();

  const { loading, value: priceData } = useFetch(
    `https://${chain}-api.dotreasury.com/overview`,
  );
  const price = priceData?.latestSymbolPrice;

  return {
    loading,
    price,
  };
}
