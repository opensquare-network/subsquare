import Chains from "./consts/chains";

export default function isShibuya() {
  return Chains.shibuya === process.env.NEXT_PUBLIC_CHAIN;
}
