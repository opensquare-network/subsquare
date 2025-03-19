import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback } from "react";
import { AddressComboListItemAccount } from "next-common/components/addressCombo";

export function ConnectedAccountItem({ user }) {
  return (
    <AccountItem
      suffix={<span className="text12Medium text-textTertiary">Connected</span>}
      user={user}
      isConnected={true}
      className={"bg-neutral200 border-none"}
    />
  );
}

export default function AccountItem({
  user,
  isConnected = false,
  suffix = null,
  className = "",
  onClick,
}) {
  const handleClick = useCallback(() => {
    if (isConnected) {
      return;
    }

    if (onClick) {
      onClick(user);
    }
  }, [isConnected, onClick, user]);

  return (
    <div
      role="button"
      onClick={handleClick}
      className={cn(
        "h-16 flex items-center justify-between gap-[12px] pl-3 pr-2.5 border border-neutral400 rounded-lg",
        className,
      )}
    >
      <AddressComboListItemAccount account={user} />
      {suffix || (
        <ArrowRight className="w-5 h-5 text-textTertiary cursor-pointer" />
      )}
    </div>
  );
}
