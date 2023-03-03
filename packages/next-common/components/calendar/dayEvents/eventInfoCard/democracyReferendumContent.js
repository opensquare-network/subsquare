import styled from "styled-components";

const InfoItem = styled.div`
  display: flex;
`;

export default function DemocracyReferendumContent({ data }) {
  return (
    <>
      <InfoItem>Index: #17</InfoItem>
      <InfoItem>Beneficiary: OpenSquare</InfoItem>
      <InfoItem>Payout: 12</InfoItem>
      <InfoItem>Description: xxxxxxx</InfoItem>
    </>
  );
}
