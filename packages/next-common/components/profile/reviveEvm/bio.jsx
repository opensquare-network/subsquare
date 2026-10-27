import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import AddressInfo from "./addressInfo";
import Panels from "./panels";

export default function Bio({ evmAddress, substrateAddress, isResolving }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "px-6 grid gap-[16px]",
        isMobile ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      <AddressInfo
        evmAddress={evmAddress}
        substrateAddress={substrateAddress}
        isResolving={isResolving}
      />
      <Panels address={substrateAddress} isResolving={isResolving} />
    </div>
  );
}
