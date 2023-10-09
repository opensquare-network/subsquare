import React, { memo } from "react";
import Identity from "../Identity";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import { useChain } from "next-common/context/chain";
import Gravatar from "../gravatar";

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
  const chain = useChain();
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

  const polkassemblyUserLink = `https://${chain}.polkassembly.io/user/${user.username}`;

  return (
    <UserWrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>{avatar}</AvatarWrapper>
      )}
      <LinkWrapper
        href={polkassemblyUserLink}
        target="_blank"
        rel="noreferrer"
        color={color}
        onClick={(e) => e.stopPropagation()}
      >
        {userIdentity}
      </LinkWrapper>
    </UserWrapper>
  );
}

export default memo(PolkassemblyUser);
