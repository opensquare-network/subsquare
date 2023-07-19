import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { p_16_bold } from "next-common/styles/componentCss";
import styled from "styled-components";

export const Title = styled.div`
  margin-left: 24px;
  color: var(--textPrimary);
  ${p_16_bold}
`;

export const ListCard = styled(SecondaryCard)`
  margin-left: -24px;
  a:hover {
    text-decoration: underline;
  }
`;
