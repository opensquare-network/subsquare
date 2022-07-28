import React, { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { fetchIdentity } from "../../services/identity";
import { encodeAddressToChain } from "../../services/address";
import { nodes } from "../../utils/constants";
import Avatar from "../avatar";
import Grvatar from "../gravatar";
import Identity from "../Identity";
import { addressEllipsis } from "../../utils";
import Flex from "../styled/flex";
import Tooltip from "../tooltip";

const Wrapper = styled(Flex)`
  a {
    &:hover {
      text-decoration: underline;
    }
  }

  a,
  div {
    color: ${(props) => props.theme.textPrimary};
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
          color: ${(props) => props.theme.textPrimary}; !important;
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
  color: ${(props) => props.theme.textSecondary};
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const LinkWrapper = styled.a`
  ${(p) =>
    p.color
      ? css`
          color: ${p.color} !important;
          text-decoration-color: ${p.color} !important;
        `
      : css`
          color: ${(props) => props.theme.textPrimary} !important;
          text-decoration-color: ${(props) =>
            props.theme.textPrimary} !important;
        `}
  display: block;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

function User({
  user,
  chain,
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth,
  color,
}) {
  const address =
    add ?? user?.addresses?.find((addr) => addr.chain === chain)?.address;
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (address) {
      const identity = nodes.find((n) => n.value === chain)?.identity;
      if (!identity) return;

      fetchIdentity(identity, encodeAddressToChain(address, identity)).then(
        (identity) => setIdentity(identity)
      );
    }
  }, [address, chain]);

  if (!user && !add) {
    return (
      <DeleteAccount fontSize={fontSize}>
        <img src="/imgs/icons/avatar-deleted.svg" alt="" />
        [Deleted Account]
      </DeleteAccount>
    );
  }

  const elmUsernameOrAddr = (
    <Username fontSize={fontSize} color={color}>
      {(!user?.publicKey && user?.username) || addressEllipsis(address)}
    </Username>
  );

  const addressWithoutIdentity = maxWidth ? (
    <Tooltip content={(!user?.publicKey && user?.username) || address}>
      <div>{elmUsernameOrAddr}</div>
    </Tooltip>
  ) : (
    elmUsernameOrAddr
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

  return (
    <Wrapper noEvent={noEvent}>
      {showAvatar && (
        <AvatarWrapper>
          {address ? (
            <Avatar address={address} size={20} />
          ) : (
            <Grvatar email={user?.email} emailMd5={user?.emailMd5} size={20} />
          )}
        </AvatarWrapper>
      )}
      {address ? (
        <LinkWrapper
          color={color}
          href={`https://${chain}.subscan.io/account/${address}`}
          target="_blank"
        >
          {identity && identity?.info?.status !== "NO_ID" ? (
            <Identity
              identity={identity}
              fontSize={fontSize}
              maxWidth={maxWidth}
            />
          ) : (
            addressWithoutIdentity
          )}
        </LinkWrapper>
      ) : (
        noAddress
      )}
    </Wrapper>
  );
}

export default memo(User);
