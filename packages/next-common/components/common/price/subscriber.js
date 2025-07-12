import { useSubNativeTokenPrice } from "next-common/hooks/useFiatPrice";
import { OnlyChains } from "next-common/components/common/onlyChain";
import Chains from "next-common/utils/consts/chains";

function InnerNativeTokenPriceSubscriber() {
  useSubNativeTokenPrice();

  return null;
}

export default function NativeTokenPriceSubscriber() {
  return (
    <OnlyChains chains={[Chains.polkadot, Chains.kusama]}>
      <InnerNativeTokenPriceSubscriber />
    </OnlyChains>
  );
}
