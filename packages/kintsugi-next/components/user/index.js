import styled, { css } from "styled-components";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { encodeAddressToChain } from "services/address";
import { nodes } from "utils/constants";
import Avatar from "next-common/components/avatar";
import Grvatar from "next-common/components/gravatar";
import Identity from "next-common/components/Identity";
import { addressEllipsis } from "utils";
import Flex from "components/flex";

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
`;

const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: 8px;
`;

const Username = styled.div`
  font-weight: 500;
  word-break: break-all;
  font-size: ${(props) => props.fontSize}px;
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
  color: #1e2134 !important;
  text-decoration-color: #1e2134 !important;
  display: block;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default function User({
  user,
  chain,
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
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
          href={`https://${chain}.subscan.io/account/${address}`}
          target="_blank"
        >
          {identity && identity?.info?.status !== "NO_ID" ? (
            <Identity identity={identity} fontSize={fontSize} />
          ) : (
            <Username fontSize={fontSize}>
              {user?.username ?? addressEllipsis(add)}
            </Username>
          )}
        </LinkWrapper>
      ) : (
        <Username fontSize={fontSize}>{user?.username}</Username>
      )}
    </Wrapper>
  );
}
