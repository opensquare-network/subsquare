import styled from "styled-components";

const Wrapper = styled.a`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
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

export default function IconLink({ icon, href, size = 20 }) {
  return (
    <Wrapper size={size} href={href} target="_blank" rel="noreferrer">
      {icon}
    </Wrapper>
  );
}
