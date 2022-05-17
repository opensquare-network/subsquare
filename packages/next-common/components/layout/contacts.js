import React from "react";
import ExternalLink from "../externalLink";
import ElementIcon from "../../assets/imgs/icons/element.svg";
import MailIcon from "../../assets/imgs/icons/mail.svg";
import styled from "styled-components";
import Flex from "../styled/flex";

const FlexWrapper = styled(Flex)`
  gap: 8px;
  a {
    display: flex;
    align-items: center;
  }

  > a svg:hover {
    * {
      fill: #9da9bb;
    }
  }
`;

export default function Contacts(){
  return <FlexWrapper>
    {/*<ExternalLink href="http://docs.subsquare.io/" title="Document">*/}
    {/*  <DocsIcon />*/}
    {/*</ExternalLink>*/}
    <ExternalLink href="https://app.element.io/#/room/#opensquare:matrix.org" title="Element">
      <ElementIcon />
    </ExternalLink>
    <ExternalLink href="mailto:hi@opensquare.network" title="Send EMail">
      <MailIcon />
    </ExternalLink>
  </FlexWrapper>
}
