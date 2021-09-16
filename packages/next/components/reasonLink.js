import styled from "styled-components";
import { extractLinks, getLinkNameAndLogo } from "utils/viewfuncs";

const ReasonText = styled.span`
`;

const LogoLink = styled.a`
`;

const LinkLogo = styled.img`
  margin-left: 9px;
  cursor: pointer;
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
            <LinkLogo src={logo} alt={name} />
          </LogoLink>
        );
      })}
    </>
  )
}
