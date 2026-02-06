import { SystemPlus } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  svg path {
    fill: var(--textTertiary);
  }
  :hover {
    svg path {
      fill: var(--textPrimary);
    }
  }
`;

export default function PlusIcon({ size = 16 }) {
  return (
    <Wrapper>
      <SystemPlus width={size} height={size} />
    </Wrapper>
  );
}
