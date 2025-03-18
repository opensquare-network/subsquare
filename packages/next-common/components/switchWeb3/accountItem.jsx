import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import { addressEllipsis } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback } from "react";

const DisplayUserAvatar = ({ user }) => {
  return (
    <AvatarDisplay
      avatarCid={user?.avatarCid}
      address={user?.address}
      emailMd5={user?.emailMd5}
      size={40}
    />
  );
};

const DisplayUser = ({ user }) => {
  const address = user?.address;
  if (isPolkadotAddress(address) || isEthereumAddress(address)) {
    return <AddressUser add={address} showAvatar={false} fontSize={14} />;
  }

  return <div className="text-textPrimary text14Bold">{user?.meta?.name}</div>;
};

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
        "h-16 relative flex items-center pl-3 pr-2.5 gap-[12px] border border-neutral400 rounded-lg",
        className,
      )}
    >
      <DisplayUserAvatar user={user} />
      <div className="flex flex-col">
        <DisplayUser user={user} />
        <Copyable className="max-md:hidden text-textTertiary text12Medium inline-flex items-center">
          {maybeEvmAddress}
        </Copyable>
        <Copyable
          className="md:hidden text-textTertiary text12Medium"
          copyText={maybeEvmAddress}
        >
          {addressEllipsis(maybeEvmAddress)}
        </Copyable>
      </div>
      {suffix || (
        <ArrowRight className="w-5 h-5 text-textTertiary cursor-pointer absolute right-2.5" />
      )}
    </div>
  );
}
