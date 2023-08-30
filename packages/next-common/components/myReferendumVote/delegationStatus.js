import styled from "styled-components";
import User from "../user";

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  background: var(--neutral200);
  padding: 10px 16px;
  gap: 4px;
`;

export default function DelegationStatus({ delegatingTarget }) {
  return (
    <Wrapper>
      <span className="text-textTertiary text14Medium">Delegated to</span>
      <User add={delegatingTarget} showAvatar={false} maxWidth={133} />
    </Wrapper>
  );
}
