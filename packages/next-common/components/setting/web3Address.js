import React from "react";
import styled from "styled-components";
import { Label, InputWrapper } from "./styled";
import User from "../user";
import { addressEllipsis } from "../../utils";

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;

  background: ${(props) => props.theme.grey100Bg};

  border: 1px solid ${(props) => props.theme.grey200Border};
  border-radius: 4px;
`;

const FullAddress = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.textTertiary};
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const ShortAddress = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.textTertiary};
  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

export default function Web3Address({ address, chain }) {
  return (
    <div>
      <Label>Web3 Address</Label>
      <InputWrapper>
        <AddressWrapper>
          <User add={address} chain={chain} />
          <FullAddress>{address}</FullAddress>
          <ShortAddress>{addressEllipsis(address)}</ShortAddress>
        </AddressWrapper>
      </InputWrapper>
    </div>
  );
}
