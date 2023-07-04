import React from "react";
import styled from "styled-components";
import { addressEllipsis } from "../../utils";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import Identity from "../Identity";

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

export default function Web3Address({ address }) {
  const [identity, hasId] = useIdentityInfo(address);

  return (
    <AddressWrapper>
      <Avatar address={address} size={40} />
      <div>
        {hasId ? <Identity identity={identity} /> : addressEllipsis(address)}
        <div>
          <FullAddress>{address}</FullAddress>
          <ShortAddress>{addressEllipsis(address)}</ShortAddress>
        </div>
      </div>
    </AddressWrapper>
  );
}
