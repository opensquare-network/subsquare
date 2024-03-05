import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import { DotreasuryChainAccountLink } from "./dotreasuryAccountLink";
import { StatescanChainAccountLink } from "./statescanAccountLink";
import { SubScanChainAccountLink } from "./subscanAccountLink";
import MailLink from "./mailLink";
import WebLink from "./webLink";
import ElementLink from "./elementLink";
import TwitterLink from "./twitterLink";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";
import { ChainCouncilorLink } from "./councilorLink";
import Chains from "next-common/utils/consts/chains";

const Wrapper = styled(Flex)`
  height: 20px;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export function ChainAccountLinks({ chain, address }) {
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity?.info || {};
  const showCouncilorLink = [Chains.polkadot, Chains.kusama].includes(chain);

  return (
    <Wrapper>
      <StatescanChainAccountLink chain={chain} address={address} />
      <DotreasuryChainAccountLink chain={chain} address={address} />
      <SubScanChainAccountLink chain={chain} address={address} />
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
      {showCouncilorLink && (
        <ChainCouncilorLink chain={chain} address={address} />
      )}
    </Wrapper>
  );
}

export default function AccountLinks({ address }) {
  const chain = useChain();

  if (!address) {
    throw new Error("No address provided");
  }

  return <ChainAccountLinks chain={chain} address={address} />;
}
