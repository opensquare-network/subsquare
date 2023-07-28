import { SystemPlus } from "@osn/icons/subsquare";
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

export default function PlusIcon({ size = 16 }) {
  return (
    <Wrapper>
      <SystemPlus width={size} height={size} />
    </Wrapper>
  );
}
