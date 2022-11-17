import User from "../../../user";
import { ValueWrapper } from "./styled";
import { toPrecision } from "../../../../utils";
import Tooltip from "../../../tooltip";
import styled from "styled-components";
import Flex from "../../../styled/flex";
import { useDecimals, useVoteSymbol } from "../../../../context/chain";

const BondValueWrapper = styled(Flex)`
  gap: 8px;

  &::before {
    content: "·";
    color: ${(p) => p.theme.textTertiary};
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

export default function UserBond({ address, bond }) {
  const decimals = useDecimals();
  const symbol = useVoteSymbol();

  return (
    <ValueWrapper>
      <User add={address} fontSize={14} />
      <BondValue deposit={bond} decimals={decimals} symbol={symbol} />
    </ValueWrapper>
  );
}
