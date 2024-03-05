import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

export const Wrapper = styled.div``;

export const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--textTertiary);
  margin-bottom: 16px;
  margin-top: 24px;
  :first-child {
    margin-top: 0;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export const Item = styled(Flex)`
  color: var(--textSecondary);
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
  :hover {
    background: var(--neutral200);
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export const UserWrapper = styled(Flex)`
  border: 1px solid var(--neutral400);
  border-radius: 8px;
  padding: 0 12px;
  height: 38px;
  font-weight: 500;
  margin-bottom: 8px;
  > :first-child {
    margin-right: 8px;
  }
`;
