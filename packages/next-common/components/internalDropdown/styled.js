import styled from "styled-components";
import { NeutralPanel } from "../styled/containers/neutralPanel";

export const OptionWrapper = styled(NeutralPanel)`
  position: absolute;
  right: 0;
  bottom: calc(100% + 10px);
  width: 96px;
  padding: 8px 0;
  border-radius: 4px;
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  color: var(--textPrimary);
`;

export const OptionItem = styled.div`
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding: 0 12px;
  font-weight: 500;
  color: var(--textPrimary);

  :hover {
    background: var(--neutral200);
  }
`;
