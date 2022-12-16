import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";

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

  > :nth-child(2),
  > :nth-child(3),
  > :nth-child(4) {
    ::before {
      content: "·";
      margin-right: 8px;
    }
    display: flex;
    > .value {
      margin-left: 4px;
      color: ${(p) => p.theme.textSecondary};
    }
  }
`;

export default function BeenDelegatedInfo({ beenDelegatedList }) {
  const node = useChainSettings();

  const balance = beenDelegatedList.reduce(
    (acc, cur) => acc.plus(cur.balance),
    new BigNumber(0)
  );
  const support = beenDelegatedList.reduce(
    (acc, cur) => acc.plus(cur.balance),
    new BigNumber(0)
  );

  return (
    <Wrapper>
      <span>Been delegated</span>
      <div>
        <span>Balance</span>
        <div className="value">
          <ValueDisplay
            value={toPrecision(balance, node.decimals)}
            symbol={node.symbol}
          />
        </div>
      </div>
      <div>
        <span>Support</span>
        <div className="value">
          <ValueDisplay
            value={toPrecision(support, node.decimals)}
            symbol={node.symbol}
          />
        </div>
      </div>
      <div>
        <span>By</span>
        <div className="value">
          {beenDelegatedList.length}{" "}
          {beenDelegatedList.length === 1 ? "Address" : "Addresses"}
        </div>
      </div>
    </Wrapper>
  );
}
