import React, { memo, useMemo } from "react";
import { UnStyledIdentity } from "../Identity";
import Link from "next/link";
import { AvatarWrapper, UserWrapper } from "./styled";
import AddressDisplay from "./addressDisplay";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import DeletedAccount from "./deletedAccount";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "./avatarDisplay";
import { useChain } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";
import { isExternalLink } from "next-common/utils";
import ExternalLink from "../externalLink";
import { cn } from "next-common/utils";
import UserDisplay from "./userDisplay";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";

export function UserAddressLink({ address, link, needHref, children }) {
  const displayAddress = tryConvertToEvmAddress(address);
  const chain = useChain();
  if (!needHref) {
    return children;
  }

  if (isExternalLink(link)) {
    return (
      <ExternalLink externalIcon={false} href={link}>
        {children}
      </ExternalLink>
    );
  }

  let href = `/user/${displayAddress}${link}`;
  if (isAssetHubChain(chain)) {
    href = `/assethub${href}`;
  }

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </Link>
  );
}

export function AddressUserWrapper({
  className,
  address,
  avatar,
  showAvatar = true,
  avatarSize = "",
  noEvent = false,
  link = "",
  needHref = true,
  children,
}) {
  const displayAddress = tryConvertToEvmAddress(address);
  return (
    <UserWrapper noEvent={noEvent} className={className}>
      {showAvatar && (
        <AvatarWrapper>
          <AvatarDisplay
            address={displayAddress}
            avatarCid={avatar}
            size={avatarSize || `${20 / 14}em`}
          />
        </AvatarWrapper>
      )}
      <UserAddressLink address={address} link={link} needHref={needHref}>
        {children}
      </UserAddressLink>
    </UserWrapper>
  );
}

export function AddressUserImpl({
  className,
  address,
  identity,
  hasIdentity,
  avatar,
  maxWidth,
  showAvatar = true,
  avatarSize = "",
  noEvent = false,
  noTooltip = false,
  ellipsis = true,
  link = "",
  needHref = true,
  identityIconClassName = "",
  username = "",
  showBountyIdentity = true,
}) {
  const displayAddress = tryConvertToEvmAddress(address);
  const showIdentity = useMemo(() => {
    if (
      !hasIdentity ||
      (!showBountyIdentity && identity?.info?.isBountyIdentity)
    ) {
      return false;
    }

    return true;
  }, [hasIdentity, identity?.info?.isBountyIdentity, showBountyIdentity]);

  const noIdentityDisplay = useMemo(() => {
    if (username) {
      return (
        <UserDisplay
          user={{ username, address: displayAddress }}
          maxWidth={maxWidth}
          noTooltip={noTooltip}
        />
      );
    }
    return (
      <AddressDisplay
        address={displayAddress}
        maxWidth={maxWidth}
        noTooltip={noTooltip}
        ellipsis={ellipsis}
      />
    );
  }, [username, maxWidth, noTooltip, displayAddress, ellipsis]);

  const userIdentity = useMemo(
    () =>
      showIdentity ? (
        <UnStyledIdentity
          noTooltip={noTooltip}
          identity={identity}
          maxWidth={maxWidth}
          ellipsis={ellipsis}
          identityIconClassName={identityIconClassName}
        />
      ) : (
        noIdentityDisplay
      ),
    [
      showIdentity,
      noTooltip,
      identity,
      maxWidth,
      ellipsis,
      identityIconClassName,
      noIdentityDisplay,
    ],
  );

  return (
    <AddressUserWrapper
      className={className}
      address={address}
      avata={avatar}
      showAvatar={showAvatar}
      avatarSize={avatarSize}
      noEvent={noEvent}
      link={link}
      needHref={needHref}
    >
      {userIdentity}
    </AddressUserWrapper>
  );
}

function AddressUserComp({
  className = "",
  add,
  showAvatar = true,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  ellipsis = true,
  needHref = true,
  link = "",
  identityIconClassName = "",
  avatarSize = "",
  username = "",
  showBountyIdentity = true,
}) {
  const address = add;
  const { identity, hasIdentity } = useIdentityInfo(address);
  const [avatar] = useAvatarInfo(address);
  const inlineClassName = "text14Medium text-textPrimary";
  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);

  if (
    !address ||
    (!isPolkadotAddress(address) && !isEthereumAddress(address))
  ) {
    return <DeletedAccount address={address} />;
  }

  return (
    <AddressUserImpl
      address={address}
      identity={identity}
      hasIdentity={hasIdentity}
      avatar={avatar}
      maxWidth={maxWidth}
      showAvatar={showAvatar}
      avatarSize={avatarSize}
      noEvent={noEvent}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
      link={link}
      needHref={needHref}
      identityIconClassName={identityIconClassName}
      className={cn(inlineClassName, className)}
      username={username}
      showBountyIdentity={showBountyIdentity}
    />
  );
}

const AddressUser = memo(AddressUserComp);
export default AddressUser;
