import styled from "styled-components";
import ElementIcon from "../public/imgs/icons/element.svg";
import MailIcon from "../public/imgs/icons/mail.svg";
import FooterLogo from "../public/imgs/icons/footerLogo.svg";
import ExternalLink from "./externalLink";

const Wrapper = styled.footer`
  @media (max-height: 750px) {
    display: none;
  }
  color: #9da9bb;
  font-size: 12px;
  margin-bottom: 32px;

  > a:first-child {
    margin-right: 8px;
  }

  > a svg:hover {
    * {
      fill: #9da9bb;
    }
  }

  > svg:nth-child(4) {
    margin-top: 12px;
    margin-bottom: 16px;
  }

  > svg:nth-child(6) {
    margin-top: 4px;
  }

  > img {
    margin-top: 8px;
  }
`;

export default function Footer() {
  return (
    <Wrapper className="footer">
      <ExternalLink href="https://app.element.io/#/room/#opensquare:matrix.org">
        <ElementIcon />
      </ExternalLink>
      <ExternalLink href="mailto:hi@opensquare.network">
        <MailIcon />
      </ExternalLink>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="1"
        viewBox="0 0 80 1"
        fill="none"
      >
        <rect width="80" height="1" fill="#E0E4EB" />
      </svg>
      <div>{`© ${new Date().getFullYear()} SubSquare · Powered by`}</div>
      <FooterLogo />
    </Wrapper>
  );
}
