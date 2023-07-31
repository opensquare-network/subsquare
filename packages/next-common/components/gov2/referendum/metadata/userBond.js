import React from "react";
import User from "../../../user";
import { ValueWrapper } from "./styled";
import { toPrecision } from "../../../../utils";
import Tooltip from "../../../tooltip";
import styled from "styled-components";
import Flex from "../../../styled/flex";
import { useDecimals, useVoteSymbol } from "../../../../context/chain";
import RefundDecisionDeposit from "next-common/components/gov2/referendum/metadata/refund";

const BondValueWrapper = styled(Flex)`
  color: var(--textTertiary);
  gap: 8px;

  &::before {
    content: "·";
    color: var(--textTertiary);
  }
`;

function BondValue({ deposit, decimals, symbol }) {
  const value = `${toPrecision(deposit, decimals)} ${symbol}`;

  return (
    <BondValueWrapper>
      <span>{value}</span>
      <Tooltip content={`Bond: ${value}`} />
    </BondValueWrapper>
  );
}

export default function UserBond({ address, bond, children }) {
  const decimals = useDecimals();
  const symbol = useVoteSymbol();

  return (
    <ValueWrapper className="flex-wrap">
      <User add={address} fontSize={14} />
      <BondValue deposit={bond} decimals={decimals} symbol={symbol} />
      {children}
    </ValueWrapper>
  );
}

export function DecisionUserBond({ address, bond, pallet = "referenda" }) {
  return (
    <UserBond address={address} bond={bond}>
      <RefundDecisionDeposit pallet={pallet} />
    </UserBond>
  );
}
