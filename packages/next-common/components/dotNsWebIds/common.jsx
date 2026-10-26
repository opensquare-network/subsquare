import Tooltip from "next-common/components/tooltip";
import CopyButton from "next-common/components/copyButton";
import DetailButton from "next-common/components/detailButton";
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
