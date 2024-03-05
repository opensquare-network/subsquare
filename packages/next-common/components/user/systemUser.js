import React, { memo } from "react";
import Identity from "../Identity";
import Link from "next/link";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, LinkWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import { tryConvertToEvmAddress } from "next-common/utils/hydradxUtil";

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
  const avatar = address ? (
    <Avatar address={displayAddress} size={avatarSize} />
  ) : (
    <Gravatar email={user?.email} emailMd5={user?.emailMd5} size={avatarSize} />
  );

  return (
    <UserWrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper fontSize={fontSize}>{avatar}</AvatarWrapper>
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
