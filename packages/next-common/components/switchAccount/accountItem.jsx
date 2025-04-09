import { ArrowRight } from "@osn/icons/subsquare";
import { useCallback } from "react";
import Copyable from "next-common/components/copyable";
import { addressEllipsis, cn } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { IdentityDisplay } from "next-common/components/addressCombo";

function UserAvatar({ user }) {
  return (
    <AvatarDisplay
      avatarCid={user?.avatarCid}
      address={user?.address}
      emailMd5={user?.emailMd5}
      size={40}
    />
  );
}

function CopyableAddress({ address }) {
  return (
    <>
      <Copyable className="max-md:hidden text-textTertiary text12Medium inline-flex items-center">
        {address}
      </Copyable>
      <Copyable
        className="md:hidden text-textTertiary text12Medium"
        copyText={address}
      >
        {addressEllipsis(address)}
      </Copyable>
    </>
  );
}

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
  const maybeEvmAddress = tryConvertToEvmAddress(user?.address);

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
        "h-16 flex items-center justify-between gap-3 pl-3 pr-2.5 border border-neutral400 rounded-lg",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <div className="flex flex-col">
          <IdentityDisplay address={user?.address} name={user?.name} />
          <CopyableAddress address={maybeEvmAddress} />
        </div>
      </div>
      {suffix || (
        <ArrowRight className="w-5 h-5 text-textTertiary cursor-pointer" />
      )}
    </div>
  );
}
