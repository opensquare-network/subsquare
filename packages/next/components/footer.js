import styled from "styled-components";
import Flex from "./styled/flex";
import ElementIcon from "../public/imgs/icons/element.svg";
import MailIcon from "../public/imgs/icons/mail.svg";
import FooterLogo from "../public/imgs/icons/footerLogo.svg";
import ExternalLink from "./externalLink";

const Wrapper = styled.footer`
  color: #9da9bb;
  font-size: 12px;

  > a:first-child {
    margin-right: 8px;
  }

  > svg:nth-child(1) {
    margin-bottom: 16px;
  }
`;

const FlexWrapper = styled(Flex)`
  a{
    display: flex;
    align-items: center;
  }

  > svg:nth-child(1) {
    margin-right: 16px;
  }

  > a:nth-child(2) {
    margin-right: 8px;
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
      >{`© ${new Date().getFullYear()} SubSquare · Powered by`}</div>
      <FlexWrapper>
        <FooterLogo />
        <ExternalLink href="https://app.element.io/#/room/#opensquare:matrix.org">
          <ElementIcon />
        </ExternalLink>
        <ExternalLink href="mailto:hi@opensquare.network">
          <MailIcon />
        </ExternalLink>
      </FlexWrapper>
    </Wrapper>
  );
}
