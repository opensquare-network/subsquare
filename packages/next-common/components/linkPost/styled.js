import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";

export const Info = styled.div`
  padding: 10px 16px;
  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;

  ${p_14_normal}
  color: ${(p) => p.theme.textSecondary};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
