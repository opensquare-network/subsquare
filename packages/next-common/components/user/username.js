import styled, { css } from "styled-components";

const Wrapper = styled.div`
  font-weight: 500;
  font-size: ${(props) => props.fontSize}px;
  ${(p) =>
    p.color
      ? css`
          color: ${p.color} !important;
        `
      : css`
          color: var(--textPrimary) !important;
        `}
  ${(p) =>
    p.maxWidth
      ? css`
          max-width: ${p.maxWidth}px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css`
          word-break: break-all;
        `}
`;

export default function Username({ username, fontSize, maxWidth, color }) {
  return (
    <Wrapper fontSize={fontSize} maxWidth={maxWidth} color={color}>
      {username}
    </Wrapper>
  );
}
