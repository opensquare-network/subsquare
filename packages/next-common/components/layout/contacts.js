import React from "react";
import ExternalLink from "../externalLink";
import ElementIcon from "../../assets/imgs/icons/element.svg";
import MailIcon from "../../assets/imgs/icons/mail.svg";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import useDarkMode from "../../utils/hooks/useDarkMode";
import Sun from "../../assets/imgs/icons/sun.svg";
import Moon from "../../assets/imgs/icons/moon.svg";

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

const Divider = styled.div`
  width: 1px;
  height: 8px;
  background-color: #363a4d;
`;

const ThemeToggle = styled.div`
  cursor: pointer;
  &:hover {
    svg path {
      ${(props) =>
        props?.theme === "light" &&
        css`
          fill: rgb(157, 169, 187);
        `};
      fill-opacity: 0.8;
    }
  }
`;

export default function Contacts() {
  const [theme, themeToggler] = useDarkMode();
  return (
    <FlexWrapper>
      {/*<ExternalLink href="http://docs.subsquare.io/" title="Document">*/}
      {/*  <DocsIcon />*/}
      {/*</ExternalLink>*/}
      <ExternalLink
        href="https://app.element.io/#/room/#opensquare:matrix.org"
        title="Element"
      >
        <ElementIcon />
      </ExternalLink>
      <ExternalLink href="mailto:hi@opensquare.network" title="Send EMail">
        <MailIcon />
      </ExternalLink>
      <Divider />
      <ThemeToggle onClick={themeToggler} theme={theme}>
        {theme === "light" ? <Moon /> : <Sun />}
      </ThemeToggle>
    </FlexWrapper>
  );
}
