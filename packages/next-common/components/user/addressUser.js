import React, { memo } from "react";
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

export function AddressUserImpl({
  className,
  address,
  identity,
  hasIdentity,
  avatar,
  maxWidth,
  showAvatar = true,
  noEvent = false,
  noTooltip = false,
  ellipsis = true,
  link = "",
  identityIconClassName = "",
  customDisplayName = "",
}) {
  const chain = useChain();
  const displayAddress = tryConvertToEvmAddress(address);

  const userIdentity = hasIdentity ? (
    <UnStyledIdentity
      identity={identity}
      maxWidth={maxWidth}
      ellipsis={ellipsis}
      identityIconClassName={identityIconClassName}
      customDisplayName={customDisplayName}
    />
  ) : (
    <AddressDisplay
      address={displayAddress}
      maxWidth={maxWidth}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
    />
  );

  let userIdentityLink;
  if (isExternalLink(link)) {
    userIdentityLink = (
      <ExternalLink externalIcon={false} href={link}>
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {userIdentity}
      </Link>
    );
  }

  return (
    <UserWrapper noEvent={noEvent} className={className}>
      {showAvatar && (
        <AvatarWrapper>
          <AvatarDisplay
            address={displayAddress}
            avatarCid={avatar}
            size={`${20 / 14}em`}
          />
        </AvatarWrapper>
      )}
      {userIdentityLink}
    </UserWrapper>
  );
}

function AddressUserComp({
  className = "text14Medium text-textPrimary",
  add,
  showAvatar = true,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  ellipsis = true,
  link = "",
  identityIconClassName = "",
  customDisplayName = "",
}) {
  const address = add;
  const { identity, hasIdentity } = useIdentityInfo(address);
  const [avatar] = useAvatarInfo(address);

  const maxWidth = useWidth(showAvatar, identity, propMaxWidth);

  if (!address) {
    return <DeletedAccount />;
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
      noEvent={noEvent}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
      link={link}
      identityIconClassName={identityIconClassName}
      customDisplayName={customDisplayName}
    />
  );
}

const AddressUser = memo(AddressUserComp);
export default AddressUser;
