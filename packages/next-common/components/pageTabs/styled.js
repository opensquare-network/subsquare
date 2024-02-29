import styled, { css } from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export const Wrapper = styled.div``;

export const ListWrapper = styled.div`
  margin: 16px 0;
`;

export const TabTitle = styled(TitleContainer)`
  padding: 0;
  ${(p) =>
    p.active
      ? css`
          color: var(--textPrimary);
        `
      : css`
          color: var(--textTertiary);
        `}
`;
