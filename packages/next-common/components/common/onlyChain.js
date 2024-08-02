import { useChain } from "next-common/context/chain";

export default function OnlyChain({ chain, children }) {
  const currentChain = useChain();
  if (chain !== currentChain) {
    return null;
  }

  return children;
}
