import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
// import DocsIcon from "../../assets/imgs/icons/docs.svg";
import ElementIcon from "../../assets/imgs/icons/element.svg";
import MailIcon from "../../assets/imgs/icons/mail.svg";
import FooterLogo from "../../assets/imgs/icons/footerLogo.svg";
import ExternalLink from "next-common/components/externalLink";

const Wrapper = styled.footer`
  color: #9da9bb;
  font-size: 12px;

  > a:first-child {
    margin-right: 8px;
  }

  > svg:nth-child(1) {
    margin-bottom: 16px;
  }
  
  > div:last-child{
    margin-top: 16px;
  }
`;

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

export default function Footer() {
  return (
    <Wrapper className="footer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="1"
        viewBox="0 0 80 1"
        fill="none"
      >
        <rect width="80" height="1" fill="#E0E4EB" />
      </svg>
      <div
        style={{ marginBottom: 8 }}
      >{`© ${new Date().getFullYear()} SubSquare`}</div>
      <FlexWrapper>
        <span style={{whiteSpace:"nowrap"}}>Powered by</span>
        <FooterLogo />
      </FlexWrapper>
      <FlexWrapper>
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
    </Wrapper>
  );
}
