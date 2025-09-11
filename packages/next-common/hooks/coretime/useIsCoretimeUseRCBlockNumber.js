import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default function useIsCoretimeUseRCBlockNumber(saleId) {
  const chain = useChain();
  if (Chains.polkadotCoretime === chain) {
    return saleId >= 11;
  } else if (Chains.kusamaCoretime === chain) {
    return saleId >= 17;
  }

  throw new Error(
    `Unknown chain ${chain} when call useIsCoretimeUseRCBlockNumber`,
  );
}
