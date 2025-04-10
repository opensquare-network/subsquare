import styled from "styled-components";

const Wrapper = styled.a`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: inline-flex;
  cursor: pointer;
  svg path {
    fill: var(--textTertiary);
  }
  :hover {
    svg path {
      fill: var(--textSecondary);
    }
  }
`;

export default function IconLink({ icon, href, width = 20, height = 24 }) {
  return (
    <Wrapper width={width} height={height} href={href} target="_blank" rel="noreferrer">
      {icon}
    </Wrapper>
  );
}
