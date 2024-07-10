import { useOnchainData } from "next-common/context/post";
import useTreasurySpendRequest from "next-common/hooks/treasury/spend/useTreasurySpendRequest";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import React from "react";
import AddressUser from "next-common/components/user/addressUser";

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  display: flex;
  padding: 12px 0;
  :not(:last-child) {
    border-bottom: 1px solid var(--neutral300);
  }
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

const InfoItemName = styled.div`
  font-weight: 500;
`;

const InfoItemValue = styled.div`
  display: flex;
  justify-content: right;
  flex-grow: 1;
  font-weight: 400;

  > a {
    color: var(--sapphire500);
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Meta() {
  const onchainData = useOnchainData();
  const meta = onchainData?.meta || {};
  const { amount, symbol, decimals, beneficiary } =
    useTreasurySpendRequest(meta);

  if (!symbol) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <Info>
        <InfoItem>
          <InfoItemName>Request</InfoItemName>
          <InfoItemValue>
            <ValueDisplay
              value={toPrecisionNumber(amount, decimals)}
              symbol={symbol}
            />
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemName>Beneficiary</InfoItemName>
          <InfoItemValue>
            <AddressUser add={beneficiary} />
          </InfoItemValue>
        </InfoItem>
      </Info>
    </SecondaryCardDetail>
  );
}
