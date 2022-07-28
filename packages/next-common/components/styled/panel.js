import React from "react";
import styled from "styled-components";
import { PrimaryCard } from "./containers/primaryCard";

const EditablePanelWrapper = styled(PrimaryCard)`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export const EditablePanel = ({ children, ...props }) => {
  return <EditablePanelWrapper {...props}>{children}</EditablePanelWrapper>;
};
