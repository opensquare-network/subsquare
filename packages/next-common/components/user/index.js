import React, { memo, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { fetchIdentity } from "../../services/identity";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import Identity from "../Identity";
import { addressEllipsis, isKeyRegisteredUser } from "../../utils";
import Flex from "../styled/flex";
import Tooltip from "../tooltip";
import AvatarDeleted from "../../assets/imgs/icons/avatar-deleted.svg";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Link from "next/link";
import { useChainSettings } from "../../context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import { KNOWN_ADDR_MATCHERS } from "next-common/utils/knownAddr";
import { IdentitySpecial } from "@osn/icons/subsquare";

const Wrapper = styled(Flex)`
  a {
    &:hover {
      text-decoration: underline;
    }
  }

  a,
  div {
    ${(p) =>
      p.color
        ? css`
            color: ${p.color};
          `
        : css`
            color: var(--textPrimary);
          `}
  }

  ${(p) =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
`;

const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: 8px;
  svg {
    circle:first-child {
      fill: var(--neutral200);
    }
  }
`;

const Username = styled.div`
  font-weight: 500;
  font-size: ${(props) => props.fontSize}px;
  ${(p) =>
    p.color
      ? css`
          color: ${p.color} !important;
        `
      : css`
          color: var(--textPrimary) !important;
        `}
  ${(p) =>
    p.maxWidth
      ? css`
          max-width: ${p.maxWidth}px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css`
          word-break: break-all;
        `}
`;

const DeleteAccount = styled(Flex)`
  font-weight: 500;
  word-break: break-all;
  font-size: ${(props) => props.fontSize}px;
  color: var(--textSecondary);
  > svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    circle:last-child {
      fill: var(--neutral400);
    }
    circle:first-child {
      fill: var(--neutral200);
    }
  }
`;

const LinkWrapper = styled.a`
  width: max-content;
  ${(p) =>
    p.color
      ? css`
          color: ${p.color} !important;
          text-decoration-color: ${p.color} !important;
        `
      : css`
          color: var(--textPrimary) !important;
          text-decoration-color: var(--textPrimary) !important;
        `}
  display: block;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const widths = {
  // avatar + avatar margin right
  avatar: 28,
  // identity icon + identity margin right
  identity: 16,
};

function User({
  user,
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  linkToVotesPage = false,
  ellipsis = true,
}) {
  const settings = useChainSettings();
  const address = add ?? user?.address;
  const isKeyUser = isKeyRegisteredUser(user);
  const isMounted = useIsMounted();
  const [identity, setIdentity] = useState(null);
  const knownAddr = KNOWN_ADDR_MATCHERS.map((matcher) => matcher(address)).find(
    Boolean,
  );

  useEffect(() => {
    setIdentity(null);
    if (address) {
      fetchIdentity(
        settings.identity,
        encodeAddressToChain(address, settings.identity),
      ).then((identity) => isMounted.current && setIdentity(identity));
    }
  }, [address, settings]);

  const maxWidth = useMemo(() => {
    if (!propMaxWidth) return propMaxWidth;

    let res = propMaxWidth;
    if (showAvatar) {
      res -= widths.avatar;
    }
    if (identity) {
      res -= widths.identity;
    }

    return res;
  }, [showAvatar, identity, propMaxWidth]);

  if (!user && !add) {
    return (
      <DeleteAccount fontSize={fontSize}>
        <AvatarDeleted />
        [Deleted Account]
      </DeleteAccount>
    );
  }

  const elmUsernameOrAddr = (
    <Username fontSize={fontSize} color={color} maxWidth={maxWidth}>
      {knownAddr ||
        (!isKeyUser && user?.username) ||
        (ellipsis ? addressEllipsis(address) : address)}
    </Username>
  );

  const addressWithoutIdentity = (
    <div className="flex items-center gap-[4px]">
      {knownAddr && (
        <Tooltip content="Special account">
          <IdentitySpecial width={12} height={12} />
        </Tooltip>
      )}
      {maxWidth && !noTooltip ? (
        <Tooltip content={(!isKeyUser && user?.username) || address}>
          <div>{elmUsernameOrAddr}</div>
        </Tooltip>
      ) : (
        elmUsernameOrAddr
      )}
    </div>
  );

  const elmUsername = (
    <Username fontSize={fontSize} maxWidth={maxWidth} color={color}>
      {user?.username}
    </Username>
  );

  const noAddress = maxWidth ? (
    <Tooltip content={user?.username}>
      <div>{elmUsername}</div>
    </Tooltip>
  ) : (
    elmUsername
  );

  let linkUserPage = `/user/${address ?? user?.username}`;
  if (linkToVotesPage) {
    linkUserPage = `${linkUserPage}/votes`;
  }

  return (
    <Wrapper noEvent={noEvent} color={color}>
      {showAvatar && (
        <AvatarWrapper>
          {address ? (
            <Avatar address={address} size={fontSize * (20 / 14)} />
          ) : (
            <Gravatar
              email={user?.email}
              emailMd5={user?.emailMd5}
              size={fontSize * (20 / 14)}
            />
          )}
        </AvatarWrapper>
      )}
      <Link href={linkUserPage} passHref legacyBehavior>
        <LinkWrapper color={color} onClick={(e) => e.stopPropagation()}>
          {address ? (
            identity && identity?.info?.status !== "NO_ID" ? (
              <Identity
                identity={identity}
                fontSize={fontSize}
                maxWidth={maxWidth}
              />
            ) : (
              addressWithoutIdentity
            )
          ) : (
            noAddress
          )}
        </LinkWrapper>
      </Link>
    </Wrapper>
  );
}

export default memo(User);
