import styled from "styled-components";

const Wrapper = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: #1e2134;
`;

const InfoItem = styled.div`
  display: flex;
`;

export default function Content() {
  return (
    <Wrapper>
      <InfoItem>Index: #17</InfoItem>
      <InfoItem>Beneficiary: OpenSquare</InfoItem>
      <InfoItem>Payout: 12</InfoItem>
      <InfoItem>Description: xxxxxxx</InfoItem>
    </Wrapper>
  );
}
