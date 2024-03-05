import Chains from "./consts/chains";

export default function isHydradx() {
  return [Chains.hydradx, Chains.hydradxTestnet].includes(
    process.env.NEXT_PUBLIC_CHAIN,
  );
}
