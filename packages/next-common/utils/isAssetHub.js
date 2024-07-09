import Chains from "./consts/chains";

export default function isAssetHub() {
  return [Chains.polkadotAssetHub].includes(process.env.NEXT_PUBLIC_CHAIN);
}
