import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import DotreasuryAccountLink from "./dotreasuryLink";
import { SubScanAccountLink } from "./subscanLink";
import { StatescanAccountLink } from "./statescan";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function AccountLinks({ address }) {
  if (!address) {
    throw new Error("No address provided");
  }

  return (
    <Wrapper>
      <SubScanAccountLink address={address} />
      <DotreasuryAccountLink address={address} />
      <StatescanAccountLink address={address} />
    </Wrapper>
  );
}
