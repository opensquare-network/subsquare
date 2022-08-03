import styled from "styled-components";

export const Message = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 12px 16px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  color: ${(props) => props.theme.textSecondary};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
`;
