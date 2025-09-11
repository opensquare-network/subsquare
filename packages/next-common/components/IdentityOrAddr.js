import React from "react";
import { encodeAddressToChain } from "../services/address";
import Identity from "./Identity";
import styled from "styled-components";
import { addressEllipsis } from "../utils";
import { isPolkadotAddress } from "../utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { useChainAddressIdentityInfo } from "next-common/hooks/useIdentityInfo";

const MentionBox = styled.a`
  display: flex;
  padding: 0 8px;
  gap: 2px;
  border-radius: 4px;
`;

function IdentityOrAddr({ address, network }) {
  const { identity, hasIdentity } = useChainAddressIdentityInfo(
    network,
    address,
  );

  if (!isPolkadotAddress(address) && !isEthereumAddress(address)) {
    return (
      <MentionBox href={`/user/${address}`}>
        <span>@</span>
        {address}
      </MentionBox>
    );
  }

  let encodedAddr = address;
  try {
    encodedAddr = encodeAddressToChain(address, network);
  } catch (e) {
    console.error(e);
    // don't crash the page
  }

  return (
    <div className="inline-block text14Medium text-sapphire500 bg-sapphire100">
      {hasIdentity ? (
        <MentionBox href={`/user/${address}`}>
          <span>@</span>
          <Identity identity={identity} />
        </MentionBox>
      ) : (
        <>
          <MentionBox href={`/user/${address}`}>
            <span>@</span>
            {addressEllipsis(encodedAddr)}
          </MentionBox>
        </>
      )}
    </div>
  );
}

export default IdentityOrAddr;
