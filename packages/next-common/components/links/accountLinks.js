import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import DotreasuryAccountLink from "./dotreasuryAccountLink";
import StatescanAccountLink from "./statescanAccountLink";
import SubScanAccountLink from "./subscanAccountLink";
import MailLink from "./mailLink";
import WebLink from "./webLink";
import ElementLink from "./elementLink";
import TwitterLink from "./twitterLink";
import ConditionalMimirIcon from "./conditionalMimirIcon";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";
import CouncilorLink from "./councilorLink";
import Chains from "next-common/utils/consts/chains";

const Wrapper = styled(Flex)`
  height: 20px;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function AccountLinks({
  address,
  showCouncilorLink: showCouncilorLinkProp = true,
}) {
  const chain = useChain();
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity?.info || {};

  const showCouncilorLink =
    showCouncilorLinkProp && [Chains.polkadot, Chains.kusama].includes(chain);

  if (!address) {
    throw new Error("No address provided");
  }

  return (
    <Wrapper>
      <StatescanAccountLink address={address} />
      <DotreasuryAccountLink address={address} />
      <SubScanAccountLink address={address} />
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
      {showCouncilorLink && <CouncilorLink address={address} />}
      <ConditionalMimirIcon address={address} />
    </Wrapper>
  );
}
