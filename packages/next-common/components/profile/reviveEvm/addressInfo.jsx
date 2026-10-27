import {
  DisplayUser,
  DisplayUserAddress,
} from "next-common/components/profile/bio";
import SubScanAccountLink from "next-common/components/links/subscanAccountLink";
import { VerticalDivider } from "next-common/components/styled/layout/divider";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import SubstrateAddressLink from "./substrateAddressLink";

export default function AddressInfo({
  evmAddress,
  substrateAddress,
  isResolving,
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full flex px-0 mt-0 gap-4",
        isMobile ? "flex-col items-center" : "flex-row items-start",
      )}
    >
      <div
        className={cn(
          "flex mt-0 flex-wrap w-full",
          isMobile ? "justify-center py-2" : "justify-start",
        )}
      >
        <DisplayUser
          id={evmAddress}
          className={cn("flex text20Bold", isMobile && "justify-center")}
        />
        <DisplayUserAddress
          address={evmAddress}
          className={cn(
            isMobile ? "!items-center text-center" : "flex-1 !items-start",
          )}
        >
          <div className="inline-flex items-center">
            <SubScanAccountLink address={evmAddress} />
            <VerticalDivider height={13} margin={16} />
            <SubstrateAddressLink
              substrateAddress={substrateAddress}
              isResolving={isResolving}
            />
          </div>
        </DisplayUserAddress>
      </div>
    </div>
  );
}
