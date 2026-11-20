import { UserAvatar } from "../relationshipPopup/userNode";
import { CopyableAddress } from "../profile/bio";
import { useIsMobile } from "../overview/accountInfo/components/accountBalances";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import { cn } from "next-common/utils";

export function ContactAccount({ contact, className = "" }) {
  const chain = useChain();
  const isMobile = useIsMobile();
  const address = encodeAddressToChain(contact.address, chain);

  return (
    <div className={cn("flex items-center gap-x-3 min-w-0", className)}>
      <UserAvatar address={address} size={40} />
      <div className="flex flex-col justify-between min-w-0">
        <span
          className="text14Medium text-textPrimary truncate"
          title={contact.name}
        >
          {contact.name}
        </span>
        <CopyableAddress
          className="!text12Medium text-textTertiary break-all"
          address={address}
          ellipsisAddress={isMobile}
        />
      </div>
    </div>
  );
}
