import Chains from "./consts/chains";

export default function isCentrifuge() {
  return Chains.centrifuge === process.env.NEXT_PUBLIC_CHAIN;
}
