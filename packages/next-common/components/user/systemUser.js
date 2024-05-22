import React, { memo } from "react";
import Identity from "../Identity";
import Link from "next/link";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "./avatarDisplay";

function SystemUser({
  user,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  linkToVotesPage = false,
  ellipsis = true,
}) {
  const address = user?.address;
  const displayAddress = tryConvertToEvmAddress(address);

  const [identity, hasIdentity] = useIdentityInfo(address);
  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);
  const [avatar] = useAvatarInfo(address);

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

  let linkUserPage = `/user/${displayAddress ?? user?.username}`;
  if (linkToVotesPage) {
    linkUserPage = `${linkUserPage}/votes`;
  }

  const avatarSize = fontSize * (20 / 14);

  return (
    <UserWrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>
          <AvatarDisplay
            address={displayAddress}
            emailMd5={user?.emailMd5}
            avatarCid={avatar}
            size={avatarSize}
          />
        </AvatarWrapper>
      )}
      <Link href={linkUserPage} passHref legacyBehavior>
        <LinkWrapper color={color} onClick={(e) => e.stopPropagation()}>
          {userIdentity}
        </LinkWrapper>
      </Link>
    </UserWrapper>
  );
}

export default memo(SystemUser);
