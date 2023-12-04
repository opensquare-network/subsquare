import React from "react";
import { ValueWrapper } from "./styled";
import { toPrecision } from "../../../../utils";
import Tooltip from "../../../tooltip";
import styled from "styled-components";
import Flex from "../../../styled/flex";
import { useDecimals, useVoteSymbol } from "../../../../context/chain";
import DecisionDepositRefund from "next-common/components/gov2/referendum/metadata/decisionDepositRefund";
import SubmissionDepositRefund from "./submissionDepositRefund";
import AddressUser from "next-common/components/user/addressUser";

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
      <AddressUser add={address} />
      <BondValue deposit={bond} decimals={decimals} symbol={symbol} />
      {children}
    </ValueWrapper>
  );
}

export function DecisionUserBond({ address, bond, pallet = "referenda" }) {
  return (
    <UserBond address={address} bond={bond}>
      <DecisionDepositRefund pallet={pallet} />
    </UserBond>
  );
}

export function SubmissionUserBond({ address, bond, pallet = "referenda" }) {
  return (
    <UserBond address={address} bond={bond}>
      <SubmissionDepositRefund pallet={pallet} />
    </UserBond>
  );
}
