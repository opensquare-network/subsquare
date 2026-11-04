import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import DotreasuryAccountLink from "./dotreasuryAccountLink";
import StatescanAccountLink from "./statescanAccountLink";
import SubScanAccountLink from "./subscanAccountLink";
import NeckworkAccountLink from "./neckworkAccountLink";
import ConditionalMimirIcon from "./conditionalMimirIcon";
import { useChainSettings } from "next-common/context/chain";
import IdentityInfoLinks from "./identityInfoLinks";

const Wrapper = styled(Flex)`
  height: 20px;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function AccountLinks({ address }) {
  const chainSettings = useChainSettings();

  const showConditionalMimirIcon =
    chainSettings?.multisigWallets?.mimir && chainSettings?.multisigApiPrefix;

  if (!address) {
    throw new Error("No address provided");
  }

  return (
    <Wrapper>
      <StatescanAccountLink address={address} />
      <DotreasuryAccountLink address={address} />
      <SubScanAccountLink address={address} />
      <NeckworkAccountLink address={address} />
      <IdentityInfoLinks address={address} />
      {showConditionalMimirIcon && <ConditionalMimirIcon address={address} />}
    </Wrapper>
  );
}
