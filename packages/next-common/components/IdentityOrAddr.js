import React, { useEffect, useState } from "react";
import { nodes } from "../utils/constants";
import { fetchIdentity } from "../services/identity";
import { encodeAddressToChain } from "../services/address";
import Identity from "./Identity";
import styled from "styled-components";
import { addressEllipsis } from "../utils";

const NameWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1F70C7;
`;

const MentionBox = styled.div`
  display: flex;
  padding: 0 8px;
  gap: 2px;
  line-height: 20px;
  background: #EFF5FB;
  border-radius: 4px;
`

function IdentityOrAddr({address, network}) {
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (address) {
      const identity = nodes.find((n) => n.value === network)?.identity;
      if (!identity) return;

      fetchIdentity(
        identity,
        encodeAddressToChain(address, identity)
      ).then((identity) => setIdentity(identity));
    }
  }, [address, network]);

  return (
    <NameWrapper>
      {identity && identity?.info?.status !== "NO_ID" ? (
        <MentionBox>
          <span>@</span>
          <Identity identity={identity}/>
        </MentionBox>
      ) : (
        <>
          <MentionBox>
            <span>@</span>
            {addressEllipsis(encodeAddressToChain(address, network))}
          </MentionBox>
        </>
      )}
    </NameWrapper>
  );
}

export default IdentityOrAddr;
