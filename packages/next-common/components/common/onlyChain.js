import { useChain } from "next-common/context/chain";

export function OnlyChains({ chains = [], children }) {
  const currentChain = useChain();
  if (!(chains || []).includes(currentChain)) {
    return null;
  }

  return children;
}

export default function OnlyChain({ chain, children }) {
  const currentChain = useChain();
  if (chain !== currentChain) {
    return null;
  }

  return children;
}
