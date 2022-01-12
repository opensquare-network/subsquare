import styled from "styled-components";
import { extractLinks, getLinkNameAndLogo } from "utils/viewfuncs";

const ReasonText = styled.span``;

const LogoLink = styled.a`
  margin-left: 9px;
  margin-right: 20px;
  position: relative;
`;

const Logo = styled.img`
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

export default function ReasonList({ text, hideText = false }) {
  if (!text) {
    return null;
  }

  const links = extractLinks(text);
  return (
    <>
      {!hideText && <ReasonText>{text}</ReasonText>}
      {links.map((link, index) => {
        const [name, logo] = getLinkNameAndLogo(link);
        return (
          <LogoLink key={index} href={link} target="_blank">
            <Logo src={logo} alt={name} />
          </LogoLink>
        );
      })}
    </>
  );
}
