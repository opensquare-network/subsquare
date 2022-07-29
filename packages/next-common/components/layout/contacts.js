import React from "react";
import ExternalLink from "../externalLink";
import ElementIcon from "../../assets/imgs/icons/element.svg";
import MailIcon from "../../assets/imgs/icons/mail.svg";
import styled, { css, withTheme } from "styled-components";
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

  svg {
    path {
      fill: ${(props) => props.theme.textPlaceholder};
      fill-opacity: 1;
    }
    &:hover {
      path {
        fill: ${(props) => props.theme.textTertiary};
      }
    }
  }
`;

const Divider = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  width: 1px;
  height: 8px;
  background-color: ${(props) => props.theme.grey200Border};
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

function Contacts({ theme }) {
  const [, themeToggler] = useDarkMode();
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
      <ThemeToggle onClick={themeToggler}>
        {theme?.isDark ? <Sun /> : <Moon />}
      </ThemeToggle>
    </FlexWrapper>
  );
}

export default withTheme(Contacts);
