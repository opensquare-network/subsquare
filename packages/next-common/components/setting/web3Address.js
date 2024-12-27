import React from "react";
import styled from "styled-components";
import { addressEllipsis } from "../../utils";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import Identity from "../Identity";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

const AddressWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const FullAddress = styled.div`
  font-size: 14px;
  color: var(--textTertiary);
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const ShortAddress = styled.div`
  font-size: 14px;
  color: var(--textTertiary);
  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

const Address = styled.span`
  color: var(--textPrimary);
`;

export default function Web3Address({ address }) {
  const { identity, hasIdentity } = useIdentityInfo(address);
  const maybeEvmAddress = tryConvertToEvmAddress(address);

  return (
    <AddressWrapper>
      <Avatar address={address} size={40} />
      <div>
        <Address>
          {hasIdentity ? (
            <Identity identity={identity} />
          ) : (
            addressEllipsis(maybeEvmAddress)
          )}
        </Address>
        <div>
          <FullAddress>{maybeEvmAddress}</FullAddress>
          <ShortAddress>{addressEllipsis(maybeEvmAddress)}</ShortAddress>
        </div>
      </div>
    </AddressWrapper>
  );
}
