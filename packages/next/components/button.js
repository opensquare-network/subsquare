import styled, { css } from "styled-components";

const Wrapper = styled.button`
  all: unset;
  background: #1e2134;
  padding: 0 12px;
  color: #ffffff;
  font-weight: bold;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  ${(p) =>
    p.primary &&
    css`
      background: #6848ff;
    `}
`;

export default function Button({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}
