import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import DotreasuryAccountLink from "./dotreasuryLink";
import { SubScanAccountLink } from "./subscanLink";
import { StatescanAccountLink } from "./statescan";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function AccountLinks({ address }) {
  const chain = useChain();
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity;
  console.log({ email, riot, twitter, web });

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
