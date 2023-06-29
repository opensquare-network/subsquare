import styled from "styled-components";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";

export const VotesGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 8px;
`;

export const VotesInfoLine = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

export const VotesGroupLabel = styled.div`
  ${p_12_medium};
  color: var(--textPrimary);
`;

export const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;
