import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import Avatar from "./avatar";
import { encodeAddressToChain } from "../services/address";
import { nodes } from "../utils/constants";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import { addressEllipsis } from "../utils";
import { useChain } from "../context/chain";

const NameWrapper = styled.div`
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: ${(props) => props.theme.textTertiary};
  }
`;

export default function Account({ account }) {
  const chain = useChain();
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (account.address) {
      const identity = nodes.find((n) => n.value === chain)?.identity;
      if (!identity) return;

      fetchIdentity(
        identity,
        encodeAddressToChain(account.address, identity)
      ).then((identity) => setIdentity(identity));
    }
  }, [account.address, chain]);

  return (
    <>
      <Avatar address={account.address} />
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>
              {addressEllipsis(encodeAddressToChain(account.address, chain))}
            </div>
          </>
        ) : (
          <>
            <div>{account?.name}</div>
            <div>
              {addressEllipsis(encodeAddressToChain(account.address, chain)) ??
                "--"}
            </div>
          </>
        )}
      </NameWrapper>
    </>
  );
}
