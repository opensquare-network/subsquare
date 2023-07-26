import { SystemMenu } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
`;

export default function DetailButton({ onClick }) {
  return (
    <Wrapper onClick={onClick}>
      <SystemMenu width={16} height={16} />
    </Wrapper>
  );
}
