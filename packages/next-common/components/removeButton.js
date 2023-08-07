import { SystemClose } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
  svg path {
    fill: var(--textPrimary);
  }
`;

export default function RemoveButton({ onClick }) {
  return (
    <Wrapper onClick={onClick}>
      <SystemClose width={16} height={16} />
    </Wrapper>
  );
}
