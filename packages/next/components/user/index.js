import styled from "styled-components";
import Identity from "./identity";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { encodeAddressToChain } from "services/address";
import { nodes } from "utils/constants";

const Username = styled.div`
  word-break: break-all;
  cursor: default;
`;

export default function User({ user, chain }) {
  const [identity, setIdentity] = useState(null);

  const address = user.addresses.find(addr => addr.chain === chain)?.address;

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

  if (!identity) {
    return (
      <Username>{user.username}</Username>
    );
  }

  return (
    <Identity identity={identity} />
  );
}
