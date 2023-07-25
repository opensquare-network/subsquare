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
import { usePageProps } from "next-common/context/page";

const Wrapper = styled(Flex)`
  height: 20px;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function AccountLinks({ address }) {
  const { identity } = usePageProps();
  const { email, riot, twitter, web } = identity?.info || {};

  if (!address) {
    throw new Error("No address provided");
  }

  return (
    <Wrapper>
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
      <StatescanAccountLink address={address} />
      <DotreasuryAccountLink address={address} />
      <SubScanAccountLink address={address} />
    </Wrapper>
  );
}
