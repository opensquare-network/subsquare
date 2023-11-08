import React, { memo } from "react";
import Identity from "../Identity";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import Gravatar from "../gravatar";
import Link from "next/link";

function PolkassemblyUser({
  user,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  ellipsis = true,
  showAvatar = true,
}) {
  const address = user?.address;
  const [identity, hasIdentity] = useIdentityInfo(address);
  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);

  if (!user) {
    return <DeletedAccount fontSize={fontSize} />;
  }

  const userIdentity = hasIdentity ? (
    <Identity identity={identity} fontSize={fontSize} maxWidth={maxWidth} />
  ) : (
    <UserDisplay
      user={user}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  const avatarSize = fontSize * (20 / 14);
  const avatar = address ? (
    <Avatar address={address} size={avatarSize} />
  ) : (
    <Gravatar email={user?.username} size={avatarSize} />
  );

  return (
    <UserWrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>{avatar}</AvatarWrapper>
      )}
      {address ? (
        <Link href={`/user/${address}/votes`}>{userIdentity}</Link>
      ) : (
        <LinkWrapper
          href={user.polkassemblyUserLink}
          target="_blank"
          rel="noreferrer"
          color={color}
          onClick={(e) => e.stopPropagation()}
        >
          {userIdentity}
        </LinkWrapper>
      )}
    </UserWrapper>
  );
}

export default memo(PolkassemblyUser);
