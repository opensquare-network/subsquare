import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import DotreasuryAccountLink from "./dotreasuryAccountLink";
import StatescanAccountLink from "./statescanAccountLink";
import SubScanAccountLink from "./subscanAccountLink";
import ConditionalMimirIcon from "./conditionalMimirIcon";
import { useChain } from "next-common/context/chain";
import CouncilorLink from "./councilorLink";
import Chains from "next-common/utils/consts/chains";
import { useChainSettings } from "next-common/context/chain";
import IdentityInfoLinks from "./identityInfoLinks";

const Wrapper = styled(Flex)`
  height: 24px;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function AccountLinks({
  address,
  showCouncilorLink: showCouncilorLinkProp = true,
}) {
  const chain = useChain();
  const chainSettings = useChainSettings();

  const showCouncilorLink =
    showCouncilorLinkProp && [Chains.polkadot, Chains.kusama].includes(chain);

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
      <IdentityInfoLinks address={address} />
      {showCouncilorLink && <CouncilorLink address={address} />}
      {showConditionalMimirIcon && <ConditionalMimirIcon address={address} />}
    </Wrapper>
  );
}
