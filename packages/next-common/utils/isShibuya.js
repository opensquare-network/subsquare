import Chains from "./consts/chains";

export default function isShibuya() {
  return [Chains.shibuya, Chains.astar].includes(process.env.NEXT_PUBLIC_CHAIN);
}
