import Tooltip from "next-common/components/tooltip";
import CopyButton from "next-common/components/copyButton";
import DetailButton from "next-common/components/detailButton";
import AddressUser from "next-common/components/user/addressUser";
import { addressEllipsis, cn } from "next-common/utils";

export function WebIdName({ label = "", className = "" }) {
  const separatorIndex = label.lastIndexOf(".");
  const name = separatorIndex > 0 ? label.slice(0, separatorIndex) : label;
  const tld = separatorIndex > 0 ? label.slice(separatorIndex) : "";

  return (
    <span className={cn("text14Medium text-textPrimary", className)}>
      {name}
      {tld && <span className="text-textTertiary">{tld}</span>}
    </span>
  );
}

export function StoreAddress({ address, className = "", onView, compact }) {
  if (!address) {
    return <span className="text14Medium text-textTertiary">-</span>;
  }

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {onView && (
        <Tooltip content="View owner's label store" className="flex">
          <DetailButton onClick={onView} className={compact ? "!p-0" : ""} />
        </Tooltip>
      )}
      <Tooltip content={address}>
        <span className="text14Medium text-textPrimary">
          {addressEllipsis(address)}
        </span>
      </Tooltip>
      <CopyButton copyText={address} />
    </div>
  );
}

export function EscrowStatusTag({ reclaimable }) {
  const content = reclaimable
    ? "The redeem window of the previous holder has elapsed, so anyone can register this name again"
    : "Held by the dotNS name escrow, the previous holder can still redeem it";

  return (
    <Tooltip content={content}>
      <span
        className={cn(
          "rounded-[10px] px-[8px] py-[2px] text12Medium",
          reclaimable
            ? "bg-green100 text-green500"
            : "bg-orange100 text-orange500",
        )}
      >
        {reclaimable ? "Reclaimable" : "In escrow"}
      </span>
    </Tooltip>
  );
}

export function WebIdOwner({ item }) {
  if (item.inEscrow) {
    return <EscrowStatusTag reclaimable={item.reclaimable} />;
  }

  return <AddressUser add={item.owner} />;
}
