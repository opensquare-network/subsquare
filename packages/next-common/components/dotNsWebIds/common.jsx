import Tooltip from "next-common/components/tooltip";
import DetailButton from "next-common/components/detailButton";
import AddressUser from "next-common/components/user/addressUser";
import { cn } from "next-common/utils";

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

function ContractIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 3.5 2 8l3.5 4.5M10.5 3.5 14 8l-3.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      <AddressUser add={address} needHref={false} maxWidth={140} />
      <Tooltip content="Contract address">
        <span className="flex text-textTertiary">
          <ContractIcon />
        </span>
      </Tooltip>
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

  return <AddressUser add={item.owner} maxWidth={160} />;
}
