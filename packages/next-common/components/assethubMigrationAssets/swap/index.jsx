import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";
import SwapCard from "./components/swapCard";
import SwapDetails from "./components/swapDetails";
import SwapSignerProvider from "./context/signer";
import { SwapProvider, useSwap } from "./context/swap";

function SwapLayout() {
  const { pools } = useSwap();

  if (!pools.loading && (!pools.tokenIn || !pools.tokenOut)) {
    return <NoDataStatusBox text="No Liquidity Pools available" />;
  }

  return (
    <div className="flex gap-6 items-start max-lg:flex-col">
      <div className="flex-1 min-w-0">
        <SwapCard />
      </div>
      <div className="w-[320px] shrink-0 max-lg:w-full">
        <SwapDetails />
      </div>
    </div>
  );
}

export default function Swap() {
  return (
    <SwapSignerProvider>
      <SwapProvider>
        <SwapLayout />
      </SwapProvider>
    </SwapSignerProvider>
  );
}
