import React, { memo } from "react";
import Identity from "../Identity";
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

export function AddressUserImpl({
  className = "",
  address,
  identity,
  hasIdentity,
  avatar,
  maxWidth,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  noTooltip = false,
  color,
  ellipsis = true,
  link = "",
  addressClassName = "",
}) {
  const chain = useChain();
  const displayAddress = tryConvertToEvmAddress(address);

  const userIdentity = hasIdentity ? (
    <Identity
      identity={identity}
      fontSize={fontSize}
      maxWidth={maxWidth}
      ellipsis={ellipsis}
      addressClassName={addressClassName}
    />
  ) : (
    <AddressDisplay
      address={displayAddress}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
      addressClassName={addressClassName}
    />
  );

  let userIdentityLink;
  if (isExternalLink(link)) {
    userIdentityLink = (
      <ExternalLink externalIcon={false} href={link} style={{ color }}>
        {userIdentity}
      </ExternalLink>
    );
  } else {
    let href = `/user/${displayAddress}${link}`;
    if (isAssetHubChain(chain)) {
      href = `/assethub${href}`;
    }

    userIdentityLink = (
      <Link
        href={href}
        style={{ color }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {userIdentity}
      </Link>
    );
  }

  const avatarSize = fontSize * (20 / 14);

  return (
    <UserWrapper noEvent={noEvent} color={color} className={className}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>
          <AvatarDisplay
            address={displayAddress}
            avatarCid={avatar}
            size={avatarSize}
          />
        </AvatarWrapper>
      )}
      {userIdentityLink}
    </UserWrapper>
  );
}

function AddressUserComp({
  className = "",
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  ellipsis = true,
  link = "",
  addressClassName = "",
}) {
  const address = add;
  const { identity, hasIdentity } = useIdentityInfo(address);
  const [avatar] = useAvatarInfo(address);

  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);

  if (!address) {
    return <DeletedAccount fontSize={fontSize} />;
  }

  return (
    <AddressUserImpl
      className={className}
      address={address}
      identity={identity}
      hasIdentity={hasIdentity}
      avatar={avatar}
      maxWidth={maxWidth}
      showAvatar={showAvatar}
      fontSize={fontSize}
      noEvent={noEvent}
      noTooltip={noTooltip}
      color={color}
      ellipsis={ellipsis}
      link={link}
      addressClassName={addressClassName}
    />
  );
}

const AddressUser = memo(AddressUserComp);
export default AddressUser;
