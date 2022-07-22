import React from "react";
import styled, { css } from "styled-components";
import { shadow_100 } from "../../styles/componentCss";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: #ffffff;
      background: #212433;
      border-color: #272a3a;
      * {
        color: #ffffff;
      }
    `};
`;

const EditablePanelWrapper = styled(Panel)`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export const EditablePanel = ({ children, ...props }) => {
  const [theme] = useDarkMode();
  return (
    <EditablePanelWrapper theme={theme} {...props}>
      {children}
    </EditablePanelWrapper>
  );
};

export default function ({ children, ...props }) {
  const [theme] = useDarkMode();
  return (
    <Panel theme={theme} {...props}>
      {children}
    </Panel>
  );
}
