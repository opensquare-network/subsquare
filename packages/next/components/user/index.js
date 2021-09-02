import styled from "styled-components";
import Identity from "./identity";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { encodeAddressToChain } from "services/address";
import { nodes } from "utils/constants";
import Avatar from "components/avatar";
import Grvatar from "components/gravatar";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  display: flex;
  margin-right: 4px;
`;

const Username = styled.span`
  font-size: 12px;
  font-weight: 600;
  word-break: break-all;
  cursor: default;
`;

export default function User({ user, chain, add, showAvatar = true }) {
  const [identity, setIdentity] = useState(null);

  const address =
    add ?? user?.addresses?.find((addr) => addr.chain === chain)?.address;

  useEffect(() => {
    setIdentity(null);
    if (address) {
      const relayChain = nodes.find((n) => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(relayChain, encodeAddressToChain(address, relayChain)).then(
        (identity) => setIdentity(identity)
      );
    }
  }, [address]);

  return (
    <Wrapper>
      {showAvatar && (
        <AvatarWrapper>
          {address ? (
            <Avatar address={address} size={20} />
          ) : (
            <Grvatar email={user?.email} size={20} />
          )}
        </AvatarWrapper>
      )}
      {identity ? (
        <Identity identity={identity} />
      ) : (
        <Username>{user?.username}</Username>
      )}
    </Wrapper>
  );
}
