import { SystemSubtract } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  padding: 2px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
  svg path {
    fill: var(--textPrimary);
  }
`;

export default function SubtractIcon({ size = 16 }) {
  return (
    <Wrapper>
      <SystemSubtract width={size} height={size} />
    </Wrapper>
  );
}
