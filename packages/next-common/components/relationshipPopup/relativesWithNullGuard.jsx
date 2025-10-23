import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

export default function RelativesWithNullGuard({ children }) {
  const chain = useChain();

  if (!isPolkadotChain(chain) && !isKusamaChain(chain)) {
    return null;
  }

  return children;
}
