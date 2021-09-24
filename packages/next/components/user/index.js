import styled, { css } from "styled-components";
import Identity from "./identity";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { encodeAddressToChain } from "services/address";
import { nodes } from "utils/constants";
import Avatar from "components/avatar";
import Grvatar from "components/gravatar";
import { addressEllipsis } from "../../utils";
import Flex from "../styled/flex";
import Image from "next/image";

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

const LinkWrapper = styled.div`
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
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (address) {
      const relayChain = nodes.find((n) => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(relayChain, encodeAddressToChain(address, relayChain)).then(
        (identity) => setIdentity(identity)
      );
    }
  }, [address, chain]);

  if (!user && !add) {
    return (
      <DeleteAccount fontSize={fontSize}>
        <Image src="/imgs/icons/avatar-deleted.svg" alt=""/>
        [Deleted Account]
      </DeleteAccount>
    );
  }

  const address =
    add ?? user?.addresses?.find((addr) => addr.chain === chain)?.address;


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
      {identity ? (
        <LinkWrapper
          onClick={() =>
            window.open(
              `https://${chain}.subscan.io/account/${address}`,
              "_blank"
            )
          }
        >
          <Identity identity={identity} fontSize={fontSize} />
        </LinkWrapper>
      ) : (
        <Username fontSize={fontSize}>
          {user?.username ?? addressEllipsis(add)}
        </Username>
      )}
    </Wrapper>
  );
}
