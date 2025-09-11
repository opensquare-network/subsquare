import React, { memo } from "react";
import { UnStyledIdentity } from "../Identity";
import Link from "next/link";
import DeletedAccount from "./deletedAccount";
import UserDisplay from "./userDisplay";
import { AvatarWrapper, UserWrapper } from "./styled";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "./avatarDisplay";

const SystemUer = memo(SystemUserImpl);
export default SystemUer;

function SystemUserImpl({
  className = "text14Medium text-textPrimary",
  user,
  showAvatar = true,
  noEvent = false,
  maxWidth,
  noTooltip = false,
  link = "",
  ellipsis = true,
}) {
  const address = user?.address;
  const displayAddress = tryConvertToEvmAddress(address);

  const { identity, hasIdentity } = useIdentityInfo(address);
  const _maxWidth = useWidth(showAvatar, identity, maxWidth);
  const [avatar] = useAvatarInfo(address);

  if (!user) {
    return <DeletedAccount />;
  }

  const userIdentity = hasIdentity ? (
    <UnStyledIdentity identity={identity} maxWidth={_maxWidth} />
  ) : (
    <UserDisplay
      user={user}
      maxWidth={_maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  const linkUserPage = `/user/${displayAddress ?? user?.username}${link}`;

  return (
    <UserWrapper noEvent={noEvent} className={className}>
      {showAvatar && (
        <AvatarWrapper>
          <AvatarDisplay
            address={displayAddress}
            emailMd5={user?.emailMd5}
            avatarCid={avatar}
            size={`${20 / 14}em`}
          />
        </AvatarWrapper>
      )}
      <Link href={linkUserPage} onClick={(e) => e.stopPropagation()}>
        {userIdentity}
      </Link>
    </UserWrapper>
  );
}
