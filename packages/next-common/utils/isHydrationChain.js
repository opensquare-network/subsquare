import Chains from "./consts/chains";

export default function isHydrationChain() {
  return [Chains.hydration, Chains.hydradxTestnet].includes(
    process.env.NEXT_PUBLIC_CHAIN,
  );
}
