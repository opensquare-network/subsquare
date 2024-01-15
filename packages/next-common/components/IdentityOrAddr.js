import React, { useEffect, useState } from "react";
import { fetchIdentity } from "../services/identity";
import { encodeAddressToChain } from "../services/address";
import Identity from "./Identity";
import styled from "styled-components";
import { addressEllipsis } from "../utils";
import { isPolkadotAddress } from "../utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import getChainSettings from "next-common/utils/consts/settings";

const MentionBox = styled.a`
  display: flex;
  padding: 0 8px;
  gap: 2px;
  border-radius: 4px;
`;

function IdentityOrAddr({ address, network }) {
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    setIdentity(null);
    if (address) {
      const settings = getChainSettings(network);
      fetchIdentity(
        settings.identity,
        encodeAddressToChain(address, settings.identity),
      ).then((identity) => setIdentity(identity));
    }
  }, [address, network]);

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
      {identity && identity?.info?.status !== "NO_ID" ? (
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
