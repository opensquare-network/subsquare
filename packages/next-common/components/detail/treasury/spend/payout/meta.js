import { useOnchainData } from "next-common/context/post";
import useTreasurySpendRequest from "next-common/hooks/treasury/spend/useTreasurySpendRequest";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import {
  SideInfoItem,
  SideInfoItemName,
  SideInfoItemValue,
} from "next-common/components/detail/common/sidebar";

const Info = styled.div`
  display: flex;
  flex-direction: column;
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
        <SideInfoItem>
          <SideInfoItemName>Request</SideInfoItemName>
          <SideInfoItemValue>
            <ValueDisplay
              value={toPrecisionNumber(amount, decimals)}
              symbol={symbol}
            />
          </SideInfoItemValue>
        </SideInfoItem>
        {beneficiary && (
          <SideInfoItem>
            <SideInfoItemName>Beneficiary</SideInfoItemName>
            <SideInfoItemValue>
              <AddressUser add={beneficiary} maxWidth={160} />
            </SideInfoItemValue>
          </SideInfoItem>
        )}
      </Info>
    </SecondaryCardDetail>
  );
}
