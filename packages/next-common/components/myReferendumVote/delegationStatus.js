import styled from "styled-components";
import AddressUser from "../user/addressUser";

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
      <span className="text-textTertiary text14Medium">Delegated vote by</span>
      <AddressUser add={delegatingTarget} showAvatar={false} maxWidth={133} />
    </Wrapper>
  );
}
