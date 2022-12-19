import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

const Wrapper = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => p.theme.textTertiary};

  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-items: center;
  padding: 4px 12px;
  gap: 8px;
  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;

  > div {
    display: inline-flex;
    & > :last-child {
      margin-left: 4px;
      color: ${(p) => p.theme.textSecondary};
    }
  }

  > :nth-child(2),
  > :nth-child(3) {
    ::before {
      content: "·";
      margin-right: 8px;
    }
  }
`;

export default function BeenDelegatedInfo({ delegations, addressesCount }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <Wrapper>
      <div>
        <span>Been delegated</span>
        <ValueDisplay
          value={toPrecision(delegations?.votes || 0, decimals)}
          symbol={symbol}
        />
      </div>
      <div>
        <span>Capital</span>
        <ValueDisplay
          value={toPrecision(delegations?.capital || 0, decimals)}
          symbol={symbol}
        />
      </div>
      <div>
        <span>By</span>
        <div className="value">
          {addressesCount} {addressesCount === 1 ? "Address" : "Addresses"}
        </div>
      </div>
    </Wrapper>
  );
}
