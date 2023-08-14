import { SystemLink } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  background: linear-gradient(
    270deg,
    rgba(4, 210, 197, 0.2) 0%,
    rgba(104, 72, 255, 0.2) 100%
  );
`;

export default function Item({ title, href }) {
  return (
    <Wrapper href={href} target="_blank">
      <span>{title}</span>
      <div>
        <SystemLink />
      </div>
    </Wrapper>
  );
}
