import React, { memo } from "react";
import Identity from "../Identity";
import Link from "next/link";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import AddressDisplay from "./addressDisplay";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import DeletedAccount from "./deletedAccount";
import { tryConvertToEvmAddress } from "next-common/utils/hydradxUtil";

export function AddressUserImpl({
  className = "",
  address,
  identity,
  hasIdentity,
  maxWidth,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  noTooltip = false,
  color,
  linkToVotesPage = false,
  ellipsis = true,
  externalLink,
}) {
  const displayAddress = tryConvertToEvmAddress(address);

  const userIdentity = hasIdentity ? (
    <Identity identity={identity} fontSize={fontSize} maxWidth={maxWidth} />
  ) : (
    <AddressDisplay
      address={displayAddress}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  let linkUserPage = `/user/${displayAddress}`;
  if (linkToVotesPage) {
    linkUserPage = `${linkUserPage}/votes`;
  }

  let userIdentityLink = (
    <Link href={linkUserPage} passHref legacyBehavior>
      <LinkWrapper color={color} onClick={(e) => e.stopPropagation()}>
        {userIdentity}
      </LinkWrapper>
    </Link>
  );

  if (externalLink) {
    userIdentityLink = (
      <LinkWrapper
        href={externalLink}
        target="_blank"
        rel="noreferrer"
        color={color}
        onClick={(e) => e.stopPropagation()}
      >
        {userIdentity}
      </LinkWrapper>
    );
  }

  const avatarSize = fontSize * (20 / 14);

  return (
    <UserWrapper noEvent={noEvent} color={color} className={className}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>
          <Avatar address={displayAddress} size={avatarSize} />
        </AvatarWrapper>
      )}
      {userIdentityLink}
    </UserWrapper>
  );
}

function AddressUser({
  className = "",
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  linkToVotesPage = false,
  ellipsis = true,
  externalLink,
}) {
  const address = add;
  const [identity, hasIdentity] = useIdentityInfo(address);

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
      maxWidth={maxWidth}
      showAvatar={showAvatar}
      fontSize={fontSize}
      noEvent={noEvent}
      noTooltip={noTooltip}
      color={color}
      linkToVotesPage={linkToVotesPage}
      ellipsis={ellipsis}
      externalLink={externalLink}
    />
  );
}

export default memo(AddressUser);
