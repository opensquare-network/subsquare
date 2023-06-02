import styled from "styled-components";

const ClaimInfoText = styled.div`
  margin-top: 16px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textTertiary};
  > span {
    color: ${(props) => props.theme.primaryPurple500};
    cursor: pointer;
  }
`;

export default function ClaimedInfo() {
  return <ClaimInfoText>This child bounty has been claimed.</ClaimInfoText>;
}
