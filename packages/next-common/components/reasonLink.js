import React from "react";
import styled from "styled-components";
import {
  defaultLinkSvg,
  extractLinks,
  getLinkIcon,
} from "../utils/viewfuncs/tip";

const ReasonText = styled.span``;

const LogoLink = styled.a`
  margin-left: 9px;
  margin-right: 20px;
  position: relative;

  > svg {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default function ReasonLink({ text, hideText = false }) {
  if (!text) {
    return null;
  }

  const links = extractLinks(text);
  return (
    <>
      {!hideText && <ReasonText>{text}</ReasonText>}
      {links.map((link, index) => {
        let SvgIcon;
        try {
          SvgIcon = getLinkIcon(link);
        } catch (e) {
          SvgIcon = defaultLinkSvg;
        }

        return (
          <LogoLink key={index} href={link} target="_blank">
            <SvgIcon />
          </LogoLink>
        );
      })}
    </>
  );
}
