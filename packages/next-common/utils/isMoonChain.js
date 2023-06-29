import Chains from "./consts/chains";

export default function isMoonChain(chain) {
  return [Chains.moonbeam, Chains.moonriver].includes(chain ?? process.env.NEXT_PUBLIC_CHAIN);
}
