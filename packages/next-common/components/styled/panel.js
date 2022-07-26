import React from "react";
import styled from "styled-components";
import { shadow_100 } from "../../styles/componentCss";

const Panel = styled.div`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  color: ${(props) => props.theme.textPrimary};
  * {
    color: ${(props) => props.theme.textPrimary};
  }
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;

const EditablePanelWrapper = styled(Panel)`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export const EditablePanel = ({ children, ...props }) => {
  return <EditablePanelWrapper {...props}>{children}</EditablePanelWrapper>;
};

export default function ({ children, ...props }) {
  return <Panel {...props}>{children}</Panel>;
}
