import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

export const Wrapper = styled.div`
  padding: 24px 0;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Username = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
`;

export const AddressWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-basis: 100%;
  flex-wrap: wrap;
`;

export const Tertiary = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--textTertiary);
`;
