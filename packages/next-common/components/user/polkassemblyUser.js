import React, { memo } from "react";
import { UnStyledIdentity } from "../Identity";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, UserWrapper } from "./styled";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import Gravatar from "../gravatar";
import Link from "next/link";
import ExternalLink from "../externalLink";

function PolkassemblyUser({
  className = "text14Medium text-textPrimary",
  user,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  ellipsis = true,
  showAvatar = true,
}) {
  const address = user?.address;
  const { identity, hasIdentity } = useIdentityInfo(address);
  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);

  if (!user) {
    return <DeletedAccount />;
  }

  const userIdentity = hasIdentity ? (
    <UnStyledIdentity identity={identity} maxWidth={maxWidth} />
  ) : (
    <UserDisplay
      user={user}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  const avatarSize = `${20 / 14}em`;
  const avatar = address ? (
    <Avatar address={address} size={avatarSize} />
  ) : (
    <Gravatar email={user?.username} size={avatarSize} />
  );

  return (
    <UserWrapper noEvent={noEvent} className={className}>
      {showAvatar && <AvatarWrapper>{avatar}</AvatarWrapper>}
      {address ? (
        <Link href={`/user/${address}/votes`}>{userIdentity}</Link>
      ) : (
        <ExternalLink
          href={user.polkassemblyUserLink}
          externalIcon={false}
          className="text-inherit hover:!underline"
        >
          {userIdentity}
        </ExternalLink>
      )}
    </UserWrapper>
  );
}

export default memo(PolkassemblyUser);
