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
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = styled(Flex)`
  a {
    &:hover {
      text-decoration: underline;
    }
  }
  ${(p) =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
  ${(props) =>
    props?.theme === "dark" &&
    css`
      a,
      div {
        color: white !important;
      }
    `};
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
          color: #1e2134 !important;
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
  color: #9da9bb;
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
          color: #1e2134 !important;
          text-decoration-color: #1e2134 !important;
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
  const [theme] = useDarkMode();
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

  const addressWithoutIdentity = maxWidth ? (
    <Tooltip content={(!user?.publicKey && user?.username) || address}>
      <div>
        <Username fontSize={fontSize} maxWidth={maxWidth} color={color}>
          {(!user?.publicKey && user?.username) || addressEllipsis(address)}
        </Username>
      </div>
    </Tooltip>
  ) : (
    <Username fontSize={fontSize} color={color}>
      {(!user?.publicKey && user?.username) || addressEllipsis(address)}
    </Username>
  );

  const noAddress = maxWidth ? (
    <Tooltip content={user?.username}>
      <div>
        <Username fontSize={fontSize} maxWidth={maxWidth} color={color}>
          {user?.username}
        </Username>
      </div>
    </Tooltip>
  ) : (
    <Username fontSize={fontSize} color={color}>
      {user?.username}
    </Username>
  );

  return (
    <Wrapper noEvent={noEvent} theme={theme}>
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
