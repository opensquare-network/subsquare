import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import Avatar from "./avatar";
import { encodeAddressToChain } from "../services/address";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import { addressEllipsis } from "../utils";
import { useChainSettings } from "../context/chain";
import { normalizeAddress } from "next-common/utils/address";

const NameWrapper = styled.div`
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: var(--textTertiary);
  }
`;

export default function Account({ account }) {
  const settings = useChainSettings();
  const [identity, setIdentity] = useState(null);

  const address = normalizeAddress(account?.address);

  useEffect(() => {
    setIdentity(null);
    if (account?.address) {
      fetchIdentity(
        settings.identity,
        encodeAddressToChain(account.address, settings.identity),
      ).then((identity) => setIdentity(identity));
    }
  }, [account?.address, settings]);

  return (
    <>
      <Avatar address={address} />
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>
              {addressEllipsis(address)}
            </div>
          </>
        ) : (
          <>
            <div>{account?.name}</div>
            <div>
              {addressEllipsis(address) ?? "--"}
            </div>
          </>
        )}
      </NameWrapper>
    </>
  );
}
