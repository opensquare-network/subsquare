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

const Username = styled.span`
  word-break: break-all;
  cursor: default;
`;

export default function User({ user, chain, showAvatar = true }) {
  const [identity, setIdentity] = useState(null);

  const address = user.addresses?.find(addr => addr.chain === chain)?.address;

  useEffect(() => {
    setIdentity(null);
    if (address) {
      const relayChain = nodes.find(n => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(
        relayChain,
        encodeAddressToChain(address, relayChain)
      ).then(identity => setIdentity(identity));
    }
  }, [address]);

  return (
    <Wrapper>
      {showAvatar && (
        <div style={{ marginRight: "4px" }}>
          {address ? (
             <Avatar address={address} />
          ) : (
             <Grvatar email={user.email} size={24} />
          )}
        </div>
      )}
      {identity ? (
        <Identity identity={identity} />
      ) : (
        <Username>{user.username}</Username>
      )}
    </Wrapper>
  )
}
