import { SystemSubtract } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  svg path {
    stroke: var(--textTertiary);
  }
  :hover {
    svg path {
      stroke: var(--textPrimary);
    }
  }
`;

export default function SubtractIcon({ size = 16 }) {
  return (
    <Wrapper>
      <SystemSubtract width={size} height={size} />
    </Wrapper>
  );
}
