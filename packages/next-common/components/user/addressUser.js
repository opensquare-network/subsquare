import React, { memo } from "react";
import Identity from "../Identity";
import Link from "next/link";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import AddressDisplay from "./addressDisplay";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";

function AddressUser({
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
    return null;
  }

  const userIdentity = hasIdentity ? (
    <Identity identity={identity} fontSize={fontSize} maxWidth={maxWidth} />
  ) : (
    <AddressDisplay
      address={address}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  let linkUserPage = `/user/${address}`;
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
    <UserWrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>
          <Avatar address={address} size={avatarSize} />
        </AvatarWrapper>
      )}
      {userIdentityLink}
    </UserWrapper>
  );
}

export default memo(AddressUser);
